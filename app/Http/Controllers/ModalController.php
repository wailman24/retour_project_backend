<?php

namespace App\Http\Controllers;

use App\Http\Resources\ModalsResource;
use App\Models\Modal;
use Illuminate\Http\Request;

class ModalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Set the number of items per page
        $perPage = 10; // You can change this number

        // Fetch paginated results from the modals table
        $modals = Modal::paginate($perPage);

        // Return the paginated data
        return response()->json($modals);

        /* return ModalsResource::collection(Modal::all()); */
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
            'name' => 'required|unique:modals'
        ]);
        $modal = Modal::create([
            'name' => $request->name,
        ]);

        return new ModalsResource($modal);
    }

    /**
     * Display the specified resource.
     */
    public function show(Modal $modal)
    {
        //NOW TO SHOW ONE AND AFTER TO SHOW WITH ALL ITS PRODUCT

        return new ModalsResource($modal);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Modal $modal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Modal $modal)
    {
        $request->validate([
            'name' => 'required|unique:modals'
        ]);

        $modal->update([
            'name' => $request->name
        ]);

        return new ModalsResource($modal);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Modal $modal)
    {
        $modal->delete();
        return response()->json([
            'message' => 'the ' . $modal->name . ' modal has been deleted'
        ]);
    }
}
