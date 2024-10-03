<?php

namespace App\Http\Controllers;

use App\Http\Resources\StocksResource;
use App\Models\Piece;
use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StocksResource::collection(Stock::all());
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
            'name' => 'required|string|max:255',
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        $product_id = $request->product_id;
        $name = $request->name;
        $quantity = $request->quantity;
        $piece_id = Piece::where('name', $name)
            ->where('product_id', $product_id)
            ->value('id');

        for ($i = 0; $i < $quantity; $i++) {
            $serialNumber = $this->generateSerialNumber();

            $stock = new Stock();
            $stock->piece_id = $piece_id;
            $stock->serial_number = $serialNumber;
            $stock->save();
        }
        return new StocksResource($stock);
    }

    // New method for decrementing pieces
    public function decrement(Request $request)
    {
        $request->validate([
            'piece_id' => 'required',
            'quantity' => 'required|integer|min:1',
        ]);

        $quantity = $request->quantity;
        $piece_id = $request->quantity;



        // Get the pieces for the product
        $pieces = Stock::where('piece_id', $piece_id)->limit($quantity)->get();

        if ($pieces->count() < $quantity) {
            return response()->json(['message' => 'Not enough pieces to remove.'], 400);
        }

        // Delete the specified quantity of pieces
        foreach ($pieces as $piece) {
            $piece->delete();
        }

        // Return the remaining stock
        $remainingStock = Stock::where('piece_id', $piece_id)->count();

        return response()->json([
            'message' => 'Stock updated successfully!',
            'remaining_quantity' => $remainingStock,
        ], 200);
    }
    private function generateSerialNumber()
    {
        //$prefix = 'SN'; // Your prefix for the serial number, adjust as needed
        $timestamp = substr(time(), -5); // Last 5 digits of the current timestamp
        $randomNumber = mt_rand(1000000000, 9999999999);
        return $timestamp . $randomNumber;
    }
    /**
     * Display the specified resource.
     */
    public function show(Stock $stock) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        //
    }
}
