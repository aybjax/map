<?php
namespace App\Types;

use JsonSerializable;

class PropertyData implements JsonSerializable
{
    public function __construct(
        public ?int $id = 0,
        public ?string $planted = '',
        public ?string $comment = '',
        public ?bool $confirmed = false,
    ) {}

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'planted' => $this->planted,
            'comment' => $this->comment,
            'confirmed' => $this->confirmed,
        ];
    }
}