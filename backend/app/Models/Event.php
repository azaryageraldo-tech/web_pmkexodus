<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'location',
        'status',
        'start_date',
        'end_date',
        'image',
        'category_id'
    ];

    protected $dates = [
        'start_date',
        'end_date',
        'deleted_at'
    ];
}
