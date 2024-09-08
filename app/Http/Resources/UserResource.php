<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $role = DB::table('roles')
            ->where('id', $this->role_id)
            ->value('name');
        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'Phone' => $this->Phone,
            'email' => $this->email,
            'password' => $this->password,
            'role' => $role,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at,
        ];
    }
}
