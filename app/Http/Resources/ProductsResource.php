<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use App\Models\Distributeur;

class ProductsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $m_name = DB::table('modals')
            ->where('id', $this->modal_id)
            ->value('name');

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
            'name' => $this->name,
            'Imei' => $this->Imei,
            'modal' => $m_name,
            'distributeur' => $userName,
            //'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
