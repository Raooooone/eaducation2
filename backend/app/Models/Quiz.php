<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model {
    protected $fillable = ['title', 'deadline', 'course_id', 'teacher_id'];
    protected $casts = ['deadline' => 'datetime'];

    public function course() { return $this->belongsTo(Course::class); }
    public function teacher() { return $this->belongsTo(User::class, 'teacher_id'); }
    public function questions() { return $this->hasMany(Question::class); }
    public function results() { return $this->hasMany(QuizResult::class); }
}