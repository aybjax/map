<?php

namespace App\Models;

use App\Types\GeoData;
use App\Types\PropertyData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'data', 'confirmed'];
    protected $hidden = ['id', 'planted', 'comment', 'confirmed', 'created_at', 'updated_at'];
    protected $appends = ['properties'];
    protected $casts = [
        'geometry' => 'array',
    ];

    public function setPropertiesAttribute(PropertyData $data)
    {
        $this->attributes['id'] = $data->id ?? null;
        $this->attributes['planted'] = $data->planted;
        $this->attributes['comment'] = $data->comment;
        $this->attributes['confirmed'] = $data->confirmed;
    }

    public function getPropertiesAttribute(): PropertyData
    {
        return new PropertyData(
            id: $this->attributes['id'],
            planted: $this->attributes['planted'],
            comment: $this->attributes['comment'],
            confirmed: $this->attributes['confirmed'],
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
}