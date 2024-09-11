<?php

namespace App\Http\Controllers;

use App\Http\Resources\RetoursResource;
use App\Models\Issue;
use Illuminate\Support\Facades\DB;
use App\Models\Retour;
use Illuminate\Http\Request;

class RetourController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return RetoursResource::collection(Retour::all());
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
    /*     public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'guarante' => 'required',
            'status' => 'required',
            'name' => 'required',
            'issue_ids' => 'required|array',
            'issue_ids.*' => 'exists:issues,id',  // Validate each issue_id
            'product_id' => 'required',
            'bon_id' => 'required|exists:bons,id'  // Ensure bon_id exists in bons table
        ]);

        // Create a new Retour record
        $retour = Retour::create([
            'guarante' => $request->guarante,
            'status' => $request->status,
            'name' => $request->name,
            'product_id' => $request->product_id
        ]);


        // Attach multiple Issues to the Retour
        $retour->issues()->sync($request->issue_ids);


        // Attach the bon_id to the retour in the pivot table
        $retour->bons()->sync($request->bon_id);


        // Load related issues and bons for proper inclusion in the resource
        $retour->load('issues', 'bons');

        return new RetoursResource($retour);
    } */

    /*  public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'guarante' => 'required',
            'status' => 'required',
            'name' => 'required',
            'pieces' => 'required|array',
            'pieces.*.id' => 'required|exists:pieces,id',
            'pieces.*.issues' => 'required|array',
            'pieces.*.issues.*' => 'required|exists:issues,id',
            'product_id' => 'required',
            'bon_id' => 'required|exists:bons,id'
        ]);

        // Create a new Retour record
        $retour = Retour::create([
            'guarante' => $request->guarante,
            'status' => $request->status,
            'name' => $request->name,
            'product_id' => $request->product_id,
            'bon_id' => $request->bon_id
        ]);

        // Prepare data for insertion into the pivot table
        $pivotData = [];

        foreach ($request->pieces as $pieceData) {
            $pieceId = $pieceData['id'];
            $issueIds = $pieceData['issues'];

            foreach ($issueIds as $issueId) {
                $pivotData[] = [
                    'retour_id' => $retour->id,
                    'piece_id' => $pieceId,
                    'issue_id' => $issueId,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        }

        $retour->bons()->sync($request->bon_id);
        // Insert data into the pivot table
        DB::table('retour_piece_issue')->insert($pivotData);

        return response()->json(['message' => 'Retour created successfully.'], 201);
    } */

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'guarante' => 'required',
            'status' => 'required',
            'name' => 'required',
            'pieces' => 'required|array',
            'pieces.*.id' => 'required|exists:pieces,id',
            'pieces.*.issues' => 'required|array',
            'pieces.*.issues.*' => 'required|exists:issues,id',
            'product_id' => 'required|exists:products,id',
            'bon_id' => 'required|exists:bons,id'
        ]);

        // Create a new Retour record
        $retour = Retour::create([
            'guarante' => $request->guarante,
            'status' => $request->status,
            'name' => $request->name,
            'product_id' => $request->product_id,
            'bon_id' => $request->bon_id
        ]);

        // Attach pieces with issues to the retour
        foreach ($request->pieces as $pieceData) {
            $pieceId = $pieceData['id'];
            $issueIds = $pieceData['issues'];

            foreach ($issueIds as $issueId) {
                $retour->pieces()->attach($pieceId, ['issue_id' => $issueId]);
            }
        }
        // Attach the bon_id to the retour in the pivot table
        $retour->bons()->attach($request->bon_id);


        // Load related issues and bons for proper inclusion in the resource
        $retour->load('issues', 'bons');

        return new RetoursResource($retour);

        //return response()->json(['message' => 'Retour created successfully.'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Retour $retour)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Retour $retour)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Retour $retour)
    {
        $request->validate([
            'guarante' => 'required',
            'status' => 'required',
            'issue_ids' => 'required|array',
            'issue_ids.*' => 'exists:issues,id',  // Validate each issue_id
            'product_id' => 'required'
        ]);

        $retour->update([
            'guarante' => $request->guarante,
            'status' => $request->status,
            'product_id' => $request->product_id
        ]);
        // Sync multiple Issues to the Retour
        $retour->issues()->sync($request->issue_ids);

        // Load related issues for proper inclusion in the resource
        $retour->load('issues');

        return new RetoursResource($retour);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Retour $retour)
    {
        $retour->delete();
    }
}
