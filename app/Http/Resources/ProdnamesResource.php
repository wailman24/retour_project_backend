<?php

namespace App\Http\Resources;

use App\Models\Modal;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Prodname;

class ProdnamesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $mod = Modal::find($this->modal_id);
        /* $piece_id = Piece::where('name', $name)
        ->where('product_id', $product_id)
        ->value('id'); */

        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'modal' => $mod->name,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
