<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /*         $creadentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (Auth::attempt([
            'email' => $request->email,
            'password' => $request->password,
        ])) {
            $user = Auth::user();

            $token = $user->createToken('adminToken')->accessToken;
            return response()->json([
                'status' => true,
                'massage' => 'User logged in successfuly',
                'token' => $token
            ]);
        } else {
            return response()->json([
                'status' => false,
                'massage' => 'Invalid Login details',
            ]);
        } */


        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('adminToken')->accessToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Invalid login details',
            ], 401); // Unauthorized status code
        }
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
        $request->validate([
            'name' => 'required|string',
            'Phone' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'role_id' => 'required'
        ]);

        $user = User::create([
            'name' => $request->name,
            'Phone' => $request->Phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id
        ]);
        $token = $user->createToken('token')->accessToken;
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

        //return new UserResource($user);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, $id)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->token()->revoke();

        return response()->json(['message' => 'Logged out successfully'], 204);
    }
}
