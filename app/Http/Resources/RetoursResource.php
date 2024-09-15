<?php

namespace App\Http\Resources;

use App\Models\Issue_Retour;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class RetoursResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {


        return [
            'id' => $this->id,
            'guarante' => $this->guarante,
            'name' => $this->name,
            'status' => $this->status,
            'product_id' => $this->product_id,
            //'date' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
