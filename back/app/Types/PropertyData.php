<?php
namespace App\Types;

use JsonSerializable;

class PropertyData implements JsonSerializable
{
    public function __construct(
        public ?int $id = 0,
        public ?string $planted = '',
        public ?int $planted_id = 0,
        public ?string $comment = '',
    ) {}

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'planted' => $this->planted,
            'planted_id' => $this->planted,
            'comment' => $this->comment,
        ];
    }
}