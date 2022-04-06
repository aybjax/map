<?php

namespace App\Models;

use App\Types\GeoData;
use App\Types\PropertyData;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'data', 'color'];
    protected $hidden = ['id', 'comment', 'created_at', 'updated_at'];
    protected $appends = ['properties'];
    protected $casts = [
        'geometry' => 'array',
    ];

    public function setPropertiesAttribute(PropertyData $data)
    {
        $current_year = intval(request()->header('X_YEAR', 2022));
        $planted = $this->plantations->first(function(PlantedCultureField $planted) use($current_year) {
            $planted->year === $current_year;
        });

        $this->attributes['id'] = $data->id ?? null;
        $this->attributes['culture_id'] = $data->planted_id;
        $this->attributes['comment'] = $data->comment;
        
        if($planted) {
            $planted->culture_id = $data->planted_id;
            $planted->comment = $data->comment;
            $planted->year = $data->year;
        }
    }

    /**
     * This year or last year
     *
     * @return PropertyData
     */
    public function getPropertiesAttribute(): PropertyData
    {
        $current_year = intval(request()->header('X_YEAR', 2022));
        $planted = PlantedCultureField::where('year', $current_year)
                    ->where('field_id', $this->id)->first();

        return new PropertyData(
            id: $this->attributes['id'],
            planted: $planted->culture?->name ?? '',
            planted_id: $planted?->culture_id ?? 0,
            comment: $planted?->comment ?? '',
            color: $planted?->culture?->color ?? '',
            year: $planted?->year,
        );
    }

    

    /**
     * This year or last year
     *
     * @return PropertyData
     */
    public function getLastPropertiesAttribute(): PropertyData
    {
        $current_year = intval(request()->header('X_YEAR', 2022));
        $planted = PlantedCultureField::where('year', $current_year-1)
                    ->where('field_id', $this->id)->first();

        return new PropertyData(
            id: $this->attributes['id'],
            planted: $planted->culture?->name ?? '',
            planted_id: $planted?->culture_id ?? 0,
            comment: $planted?->comment ?? '',
            color: $planted?->culture?->color ?? '',
            year: $planted?->year,
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

    public function suggestions()
    {
        return $this->belongsTo(SuggestionCultureField::class);
    }

    public function plantations()
    {
        return $this->hasMany(PlantedCultureField::class);
    }
}