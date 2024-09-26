<?php

namespace App\Http\Resources;

use App\Models\Issue_Retour;
use App\Models\Prodname;
use App\Models\Product;
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

        $Prod_imei = DB::table('products')
            ->where('id', $this->product_id)
            ->value('Imei',);
        $Prod_nameid = DB::table('products')
            ->where('id', $this->product_id)
            ->value('name_id',);
        $Prod_name = Prodname::where('id', $Prod_nameid)->value('name');
        return [
            'id' => $this->id,
            'guarante' => $this->guarante,
            'name' => $this->name,
            'status' => $this->status,
            'product_id' => $this->product_id,
            'Imei' => $Prod_imei,
            'prodname' => $Prod_name,
            'date' => $this->created_at->format('Y-m-d H:i:s'),
            'update' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
