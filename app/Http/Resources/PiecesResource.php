<?php

namespace App\Http\Resources;

use App\Models\Prodname;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PiecesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $prod = Prodname::find($this->product_id);
        /* $piece_id = Piece::where('name', $name)
        ->where('product_id', $product_id)
        ->value('id'); */
        $quantity = Stock::where('piece_id', $this->id)->count();
        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'product' => $prod->name,
            'quantity' => $quantity,
            //'date' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
