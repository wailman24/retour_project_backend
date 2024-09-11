<?php

namespace App\Http\Controllers;

use App\Http\Resources\BonsResource;
use App\Models\Bon;
use Illuminate\Http\Request;

class BonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return BonsResource::collection(Bon::all());
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
            'dist_id' => 'required',
        ]);

        $bon = Bon::create([
            'dist_id' => $request->dist_id,
        ]);

        return new BonsResource($bon);
    }

    /**
     * Display the specified resource.
     */
    public function show(Bon $bon)
    {
        return new BonsResource($bon);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bon $bon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bon $bon)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bon $bon)
    {
        //
    }
}
