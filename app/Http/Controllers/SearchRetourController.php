<?php

namespace App\Http\Controllers;

use App\Http\Resources\RetoursResource;
use Illuminate\Http\Request;
use App\Models\Retour;
use Illuminate\Support\Facades\DB;

class SearchRetourController extends Controller
{
    public function GetByGuarante(Request $request)
    {
        $request->validate([
            'guarante' => 'required'
        ]);

        $retours = DB::table('retours')
            ->where('guarante', '=', $request->guarante)
            ->get();

        return RetoursResource::collection($retours);
    }

    public function GetByStatus(Request $request)
    {
        $request->validate([
            'status' => 'required'
        ]);

        $retours = DB::table('retours')
            ->where('status', '=', $request->status)
            ->get();

        return RetoursResource::collection($retours);
    }
    public function GetByProduct_id(Request $request)
    {
        $request->validate([
            'product_id' => 'required'
        ]);

        $retours = DB::table('retours')
            ->where('product_id', '=', $request->product_id)
            ->get();

        return RetoursResource::collection($retours);
    }

    public function GetByPiece(Request $request)
    {
        $request->validate([
            'piece_id' => 'required'
        ]);


        $retours = DB::table('issue_retour')
            ->join('issues', 'issue_retour.issue_id', '=', 'issues.id')
            ->join('retours', 'issue_retour.retour_id', '=', 'retours.id')
            ->where('issues.piece_id', '=', $request->piece_id)
            ->select('retours.*')
            ->get();

        return RetoursResource::collection($retours);
    }
}
