<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    // LISTE TOUS LES COURS (prof + étudiants)
  // Dans CourseController@index()
   public function index()
    {
        $courses = Course::with(['teacher', 'quizzes'])->get();

        $courses->each(function ($course) {
            if ($course->pdf_path) {
                $course->pdf_url = asset('storage/' . $course->pdf_path);
            }
        });

        return response()->json($courses);
    }
    // CRÉER UN COURS (prof uniquement)
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'teacher') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'pdf'         => 'required|mimes:pdf|max:15360',
        ]);

        $pdfPath = $request->file('pdf')->store('courses/pdfs', 'public');

        $course = Course::create([
            'title'       => $request->title,
            'description' => $request->description,
            'teacher_id'  => $user->id,
            'pdf_path'    => $pdfPath,
        ]);

        // AJOUTE L'URL DIRECTE
        $course->pdf_url = asset('storage/' . $pdfPath);

        return response()->json($course, 201);
    }

    // AFFICHER UN COURS (détails + quizzes + PDF)
   public function show($id)
    {
        $course = Course::with(['teacher', 'quizzes.questions.options'])->findOrFail($id);

        if ($course->pdf_path) {
            $course->pdf_url = asset('storage/' . $course->pdf_path);
        }

        return response()->json($course);
    }
    // MODIFIER UN COURS (prof propriétaire)
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();

        if ($course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        // PDF EST OPTIONNEL ICI !
        $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'pdf'         => 'nullable|mimes:pdf|max:20480', // nullable = pas obligatoire
        ]);

        $data = $request->only(['title', 'description']);

        if ($request->hasFile('pdf')) {
            // Supprime l’ancien PDF
            if ($course->pdf_path) {
                Storage::disk('public')->delete($course->pdf_path);
            }
            $data['pdf_path'] = $request->file('pdf')->store('courses/pdfs', 'public');
        }

        $course->update($data);

        // Met à jour l’URL si PDF changé
        if (isset($data['pdf_path'])) {
            $course->pdf_url = asset('storage/' . $data['pdf_path']);
        }

        return response()->json($course);
    }

    // SUPPRIMER UN COURS
    public function destroy(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();

        if ($course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        if ($course->pdf_path) {
            Storage::disk('public')->delete($course->pdf_path);
        }

        $course->delete();

        return response()->json(['ok' => true]);
    }

    // REJOINDRE UN COURS (étudiant)
    public function join(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Seuls les étudiants peuvent rejoindre'], 403);
        }

        $course->students()->syncWithoutDetaching([$user->id]);

        return response()->json(['ok' => true]);
    }
}