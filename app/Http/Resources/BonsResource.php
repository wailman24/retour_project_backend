<?php

namespace App\Http\Resources;

use App\Models\Distributeur;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class BonsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
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
            'id' => $this->id,
            'dist_id' => $this->dist_id,
            'distributeur' => $userName,
            'date' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
