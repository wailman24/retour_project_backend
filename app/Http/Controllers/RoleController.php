<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RolesResource;
use Illuminate\Support\Facades\Session;
use RuntimeException;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return RolesResource::collection(Role::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|unique:roles',
        ]);

        $role = Role::create([
            'name' => $request->name
        ]);
        return new RolesResource($role);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $responseData = [
            'role' => new RolesResource($role),
            'users' => [],
        ];

        foreach ($role->users as $user) {
            $responseData['users'][] = [
                'id' => $user->id,
                'name' => $user->name,
            ];
        }

        return response()->json($responseData);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|unique:roles'
        ]);

        $role->update([
            'name' => $request->name,
        ]);
        return new RolesResource($role);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json([
            'message' => 'role ' . $role->name . ' has deleted'
        ]);
    }
}
