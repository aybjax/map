<?php
namespace App\Types;

use JsonSerializable;

class GeoData implements JsonSerializable
{
    public function __construct(
        public string $type = '',
        public array $coordinates = [],
    ) {}

    public function jsonSerialize() {
        return [
            'type' => $this->type,
            'coordinates' => $this->coordinates,
        ];
    }
}