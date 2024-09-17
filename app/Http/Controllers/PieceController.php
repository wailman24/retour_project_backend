<?php

namespace App\Http\Controllers;

use App\Http\Resources\PiecesResource;
use App\Models\Piece;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PieceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PiecesResource::collection(Piece::all());
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
            'product_id' => 'required',

        ]);

        $piece = Piece::create([
            'name' => $request->name,
            'product_id' => $request->product_id,
        ]);

        return new PiecesResource($piece);
    }


    /**
     * Display the specified resource.
     */
    public function show(Piece $piece)
    {
        return new PiecesResource($piece);
    }

    public function pieceofproduct($id)
    {
        $pcs = Piece::where('product_id', $id)->get();

        return PiecesResource::collection($pcs);
    }

    public function pieceofretour($id)
    {

        /*  $pcs = DB::table('pieces')
            ->join('piece_issue_reteur', 'pieces.id', '=', 'piece_issue_reteur.piece_id')
            ->where('piece_issue_reteur.retour_id', '=', $id)
            //->select('pieces.name')
            ->get(); */

        $pcs = DB::table('pieces')
            ->join('piece_issue_reteur', 'pieces.id', '=', 'piece_issue_reteur.piece_id')
            ->join('issues', 'issues.id', '=', 'piece_issue_reteur.issue_id')
            ->where('piece_issue_reteur.retour_id', '=', $id)
            ->select('pieces.name', 'issues.description')
            ->get();

        return response()->json($pcs);
        //return PiecesResource::collection($pcs);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Piece $piece)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Piece $piece)
    {
        $request->validate([
            'name' => 'required',
            'product_id' => 'required|exists:products,id'
        ]);

        $piece->update([
            'name' => $request->name,
            'product_id' => $request->product_id
        ]);

        return new PiecesResource($piece);
    }

    public function addqte(Request $request, Piece $piece)
    {
        $request->validate([
            'quantity' => 'required'
        ]);

        $piece->update([
            'quantity' => $request->quantity
        ]);

        return new PiecesResource($piece);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Piece $piece)
    {
        $piece->delete();
        return response()->json([
            'message' => 'the ' . $piece->name . ' has deleted'
        ]);
    }
}
