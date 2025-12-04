<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use App\Models\QuizResult;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    // Liste des quizzes d'un cours
    public function index($courseId)
    {
        return Quiz::with('questions.options')
                   ->where('course_id', $courseId)
                   ->get();
    }

    // Créer un quiz
    public function store(Request $request)
    {
        if ($request->user()->role !== 'teacher') {
            return response()->json(['error' => 'Accès refusé'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'deadline' => 'required|date',
            'course_id' => 'required|exists:courses,id',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_option' => 'required|integer|between:0,3',
        ]);

        $quiz = Quiz::create([
            'title' => $request->title,
            'deadline' => $request->deadline,
            'course_id' => $request->course_id,
            'teacher_id' => $request->user()->id,
        ]);

        foreach ($request->questions as $q) {
            $question = Question::create([
                'quiz_id' => $quiz->id,
                'question_text' => $q['question_text']
            ]);

            foreach ($q['options'] as $index => $text) {
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => $text,
                    'is_correct' => $index == $q['correct_option']
                ]);
            }
        }

        return response()->json(['message' => 'Quiz créé avec succès !'], 201);
    }

    // Voir un quiz
    public function show($id)
    {
        return Quiz::with('questions.options')->findOrFail($id);
    }

    // Soumission du quiz
    public function submit(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Non authentifié'], 401);

        $quiz = Quiz::with('questions.options')->findOrFail($id);
        $answers = $request->input('answers', []);
        $score = 0;
        $results = [];

        foreach ($quiz->questions as $question) {
            $options = $question->options->sortBy('id')->values();
            $optionTexts = $options->pluck('option_text')->toArray();
            $correctIndex = $options->search(fn($opt) => $opt->is_correct);

            $userAnswer = collect($answers)->firstWhere('question_id', $question->id);
            $userIndex = $userAnswer['selected_option'] ?? null;

            $isCorrect = $userIndex !== null && $correctIndex !== null && $userIndex == $correctIndex;
            if ($isCorrect) $score++;

            $results[] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'user_answer' => $userIndex,
                'correct_answer' => $correctIndex,
                'is_correct' => $isCorrect,
                'options' => $optionTexts
            ];
        }

        QuizResult::updateOrCreate(
            ['quiz_id' => $id, 'student_id' => $user->id],
            ['score' => $score]
        );

        return response()->json([
            'score' => $score,
            'total' => $quiz->questions->count(),
            'percentage' => $quiz->questions->count() > 0 ? round(($score / $quiz->questions->count()) * 100) : 0,
            'results' => $results
        ]);
    }

    /**
     * RÉSULTATS D'UN QUIZ POUR L'ENSEIGNANT
     * Route: GET /api/teacher/quizzes/{id}/results
     */
    public function teacherQuizResults($quiz_id)
    {
        $teacher = request()->user();

        // Vérifie que le quiz appartient bien à cet enseignant
        $quiz = Quiz::where('id', $quiz_id)
                    ->where('teacher_id', $teacher->id)
                    ->withCount('questions') // Charge le nombre total de questions
                    ->firstOrFail();

        $results = QuizResult::with('student')
            ->where('quiz_id', $quiz_id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($r) use ($quiz) {
                $totalQuestions = $quiz->questions_count;
                $percentage = $totalQuestions > 0 ? round(($r->score / $totalQuestions) * 100) : 0;

                return [
                    'student_id' => $r->student_id,
                    'student_name' => $r->student?->name ?? 'Étudiant supprimé',
                    'score' => $r->score,
                    'total' => $totalQuestions,
                    'percentage' => $percentage,
                    'submitted_at' => $r->updated_at->format('d/m/Y à H:i'),
                    'ago' => $r->updated_at->diffForHumans(),
                ];
            });

        return response()->json([
            'quiz_title' => $quiz->title,
            'total_questions' => $quiz->questions_count,
            'results' => $results
        ]);
    }

    // Autres méthodes (non modifiées)
    public function results($quiz_id)
    {
        return QuizResult::with('student')->where('quiz_id', $quiz_id)->get();
    }

    public function studentResult($quiz_id, $student_id)
    {
        return QuizResult::where('quiz_id', $quiz_id)
                         ->where('student_id', $student_id)
                         ->firstOrFail();
    }
}