<?php

namespace App\Http\Resources;

use App\Models\Piece;
use App\Models\Prodname;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StocksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $piece = Piece::find($this->piece_id);
        $prod_id = $piece->product_id;
        $prod = Prodname::find($prod_id);
        return [
            'id' => (string)$this->id,
            'name' => $piece->name,
            'product' => $prod->name,
            'serial_number' => $this->serial_number,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
