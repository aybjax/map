<?php

namespace App\Models;

use App\Types\PropertyData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Suggested fields
 */
class PlantedCultureField extends Model
{
    use HasFactory;

    protected $table = 'planted_culture_fields';

    protected $fillable = [
        'culture_id',
        'field_id',
        'comment',
        'year',
    ];

    protected $with = [
        'culture',
        'field',
    ];

    public function culture()
    {
        return $this->belongsTo(Culture::class);
    }

    public function field()
    {
        return $this->belongsTo(Field::class);
    }
}