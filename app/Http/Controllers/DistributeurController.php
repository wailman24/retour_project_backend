<?php

namespace App\Http\Controllers;

use App\Http\Resources\DistributeursResource;
use App\Models\Distributeur;
use App\Models\User;
use Illuminate\Http\Request;

class DistributeurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DistributeursResource::collection(Distributeur::all());
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
            'location' => 'required',
            'user_id' => 'required'
        ]);

        $distributeur = Distributeur::create([
            'location' => $request->location,
            'user_id' => $request->user_id
        ]);

        return new DistributeursResource($distributeur);
    }

    /**
     * Display the specified resource.
     */
    public function show(Distributeur $distributeur)
    {
        return new DistributeursResource($distributeur);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Distributeur $distributeur)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Distributeur $distributeur)
    {
        $request->validate([
            'location' => 'required',
            'user_id' => 'required'
        ]);

        $distributeur->update([
            'location' => $request->location,
            'user_id' => $request->user_id
        ]);

        return new DistributeursResource($distributeur);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Distributeur $distributeur)
    {
        $distributeur->delete();
        $user = User::find($distributeur->user_id);
        return response()->json([
            'message' => 'the user ' . $user->name . ' is not distributeur any more'
        ]);
    }
}
