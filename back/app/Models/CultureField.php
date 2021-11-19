<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CultureField extends Model
{
    use HasFactory;

    protected $fillable = [
        'culture_id',
        'field_id',
        'user_id',
        'comment',
    ];

    protected $with = [
        'culture',
        'field',
        'user',
    ];

    public function culture()
    {
        return $this->belongsTo(Culture::class);
    }

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}