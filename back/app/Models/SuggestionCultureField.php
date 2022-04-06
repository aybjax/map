<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Suggested fields
 */
class SuggestionCultureField extends Model
{
    use HasFactory;

    protected $table = 'suggestion_culture_fields';

    protected $fillable = [
        'culture_id',
        'field_id',
        'user_id',
        'comment',
        'year',
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