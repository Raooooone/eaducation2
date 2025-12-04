<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'description', 'teacher_id', 'pdf_path'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_student');
    }

    // AJOUTE ÇA OBLIGATOIREMENT !!!
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}