<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizResult extends Model
{
    protected $fillable = [
        'quiz_id',
        'student_id',
        'score',
        'answers', 
    ];

    protected $casts = [
        'answers' => 'array',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}