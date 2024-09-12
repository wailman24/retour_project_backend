<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProdnamesResource;
use App\Models\Prodname;
use Illuminate\Http\Request;

class ProdnameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProdnamesResource::collection(Prodname::all());
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
            'name' => 'required',
            'modal_id' => 'required',

        ]);

        $prod = Prodname::create([
            'name' => $request->name,
            'modal_id' => $request->modal_id,
        ]);

        return new ProdnamesResource($prod);
    }

    /**
     * Display the specified resource.
     */
    public function show(Prodname $prodname)
    {
        return new ProdnamesResource($prodname);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Prodname $prodname)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Prodname $prodname)
    {
        $request->validate([
            'name' => 'bail|required|unique:products',
            'modal_id' => 'required|exists:modals,id',
        ]);

        $prodname->update([
            'name' => $request->name,

            'modal_id' => $request->modal_id,

        ]);

        return new ProdnamesResource($prodname);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prodname $prodname)
    {
        $prodname->delete();
        return new ProdnamesResource($prodname);
    }
}
