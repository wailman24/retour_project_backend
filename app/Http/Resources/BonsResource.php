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
        $retours = DB::table('bon_retour')
            ->join('retours', 'bon_retour.retour_id', '=', 'retours.id')
            ->where('bon_retour.bon_id', $this->id)
            ->pluck('retours.status');  // Get all the statuses of the retours for the given bon
        if ($retours->isEmpty()) {
            // Handle the case where no retours exist
            $status = 'No Retour'; // You can set this to any status you'd like (e.g., 'Pending', 'N/A')
        } else {
            $status = 'Completed'; // Start assuming all are 'C'

            foreach ($retours as $retour) {
                if ($retour === 'B') {
                    $status = 'In Progress';  // If one is 'B', set the status to 'B'
                    break;  // No need to check further
                } elseif ($retour === 'A') {
                    $status = 'Initiated';  // If one is 'A', set the status to 'A', but keep checking for 'B'
                }
            }
        }

        return [
            'id' => $this->id,
            'dist_id' => $this->dist_id,
            'distributeur' => $userName,
            'status' => $status,
            'date' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
