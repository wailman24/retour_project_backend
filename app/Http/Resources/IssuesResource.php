<?php

namespace App\Http\Resources;

use App\Models\Piece;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssuesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => (string)$this->id,

            'description' => $this->description,
            'created_at' => $this->created_at->format('Y-m-d H:i:s')
        ];
    }
}
