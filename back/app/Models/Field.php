<?php

namespace App\Models;

use App\Types\GeoData;
use App\Types\PropertyData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'data', 'color'];
    protected $hidden = ['id', 'planted_id', 'comment', 'created_at', 'updated_at'];
    protected $appends = ['properties'];
    protected $casts = [
        'geometry' => 'array',
    ];
    protected $with = [
        'culture',
    ];

    public function setPropertiesAttribute(PropertyData $data)
    {
        $this->attributes['id'] = $data->id ?? null;
        $this->attributes['culture_id'] = $data->planted_id;
        $this->attributes['comment'] = $data->comment;
    }

    public function getPropertiesAttribute(): PropertyData
    {
        return new PropertyData(
            id: $this->attributes['id'],
            planted: $this->culture?->name ?? '',
            planted_id: $this->attributes['culture_id'],
            comment: $this->attributes['comment'],
        );
    }

    public function setGeoAttribute(GeoData $data)
    {
        $this->attributes['geometry'] = json_encode($data);
    }

    public function getGeoAttribute(): GeoData
    {
        $tmp = json_decode($this->attributes['geometry'], true);

        return new GeoData(
            type: $tmp['type'] ?? '',
            coordinates: $tmp['coordinates'] ?? [],
        );
    }

    public function culture()
    {
        return $this->belongsTo(Culture::class);
    }

    public function cultureField()
    {
        return $this->hasMany(CultureField::class);
    }
}