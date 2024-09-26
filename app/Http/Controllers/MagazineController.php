<?php

namespace App\Http\Controllers;

use App\Http\Resources\MagazinesResource;
use App\Models\Magazine;
use Illuminate\Http\Request;

class MagazineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            'piece_id' => 'required',
            'quantity' => 'required'
        ]);

        $magaz = Magazine::create([
            'piece_id' => $request->piece_id,
            'quantity' => $request->quantity
        ]);

        return new MagazinesResource($magaz);
    }

    /**
     * Display the specified resource.
     */
    public function show(Magazine $magazine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Magazine $magazine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Magazine $magazine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Magazine $magazine)
    {
        //
    }
}
