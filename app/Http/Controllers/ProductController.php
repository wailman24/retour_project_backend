<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductsResource;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProductsResource::collection(Product::all());
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
        try {
            $request->validate([
                'name_id' => 'bail|required',
                'Imei' => 'bail|required|unique:products',

                'dist_id' => ''
            ]);
            $product = Product::create([
                'name_id' => $request->name_id,
                'Imei' => $request->Imei,

                'dist_id' => $request->dist_id
            ]);
        } catch (\Throwable $caught) {
            return response()->json([
                'message' => $caught->getMessage()
            ]);
        }

        return new ProductsResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return new ProductsResource($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name_id' => 'bail|required',

        ]);

        $product->update([
            'name_id' => $request->name_id,


        ]);

        return new ProductsResource($product);
    }

    public function updateDist(Request $request, $id)
    {
        $request->validate([
            'dist_id' => 'required|integer',
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $product->dist_id = $request->dist_id;
        $product->save();

        return response()->json(['message' => 'Product updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json([
            'message' => 'the ' . $product->name . ' product has been deleted'
        ]);
    }

    public function searchByImei(Request $request)
    {
        $request->validate([
            'Imei' => 'required'
        ]);

        $product = DB::table('products')
            ->where('Imei', '=', $request->Imei)
            ->get();

        return ProductsResource::collection($product);
    }
}
