<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Culture extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
    ];

    public function fields()
    {
        return $this->hasMany(Field::class);
    }

    public function cultureField()
    {
        return $this->hasMany(CultureField::class);
    }
}