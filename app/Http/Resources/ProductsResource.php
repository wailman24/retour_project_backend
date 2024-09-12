<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use App\Models\Distributeur;
use App\Models\Prodname;

class ProductsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $p_name = DB::table('prodnames')
            ->where('id', $this->name_id)
            ->value('name');

        $prodname = Prodname::find($this->name_id);
        if ($prodname) {
            // Get the user associated with the distributeur
            $modal = DB::table('modals')
                ->where('id', $prodname->modal_id)
                ->value('name');
        }
        // Find the distributeur
        $distributeur = Distributeur::find($this->dist_id);

        // Initialize userName and userEmail with default values
        $userName = 'null';

        if ($distributeur) {
            // Get the user associated with the distributeur
            $user = DB::table('users')
                ->where('id', $distributeur->user_id)
                ->where('role_id', '2')
                ->first('name');

            if ($user) {
                // Get the user name and email
                $userName = $user->name;
            }
        }
        return [
            'id' => (string)$this->id,
            'name_id' => $this->name_id,
            'name' => $p_name,
            'Imei' => $this->Imei,
            'modal' => $modal,
            'distributeur' => $userName,
            //'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
