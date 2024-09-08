<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class DistributeursResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $cname = DB::table('users')
            ->where('id', $this->user_id)
            ->where('role_id', '2')
            ->value('name');

        $cemail = DB::table('users')
            ->where('id', $this->user_id)
            ->where('role_id', '2')
            ->value('email');

        return [
            'id' => (string)$this->id,
            'location' => $this->location,
            'user_id' => $this->user_id,
            'cname' => $cname,
            'cemail' => $cemail,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
