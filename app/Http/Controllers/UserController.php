<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, Request $request)
    {
        return new UserResource($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {

        $validatedData = $request->validate([
            'name' => 'required|string',
            'Phone' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'role_id' => 'required'
        ]);

        $user->update([
            'name' => $validatedData['name'],
            'Phone' => $validatedData['Phone'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role_id' => $validatedData['role_id']

        ]);

        return new userResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'message' => 'user ' . $user->name . ' has deleted',
        ]);
    }

    public function Clients(Request $request)
    {
        $clients = User::where('role_id', 2)->get();
        return UserResource::collection($clients);
    }
}
