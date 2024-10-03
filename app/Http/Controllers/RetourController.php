<?php

namespace App\Http\Controllers;

use App\Http\Resources\RetoursResource;
use App\Models\Issue;
use App\Models\Prodname;
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
    public function show($id)
    {
        $retour = Retour::findOrFail($id);  // Fetch the retour by ID
        return new RetoursResource($retour);
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
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $request->validate([

            'pieces' => 'required|array',
            'pieces.*.id' => 'required|exists:pieces,id',
            'pieces.*.issues' => 'required|array',
            'pieces.*.issues.*' => 'required|exists:issues,id',

        ]);

        // Find the Retour record by ID
        $retour = Retour::findOrFail($id);

        // Detach all existing pieces and issues
        $retour->pieces()->detach();

        // Re-attach pieces with issues to the retour
        foreach ($request->pieces as $pieceData) {
            $pieceId = $pieceData['id'];
            $issueIds = $pieceData['issues'];

            foreach ($issueIds as $issueId) {
                $retour->pieces()->attach($pieceId, ['issue_id' => $issueId]);
            }
        }
        return new RetoursResource($retour);
    }
    public function changestatus($id, Request $request)
    {
        $request->validate([
            'status' => 'required',
        ]);

        $retour = Retour::findOrFail($id);
        $retour->update([
            'status' => $request->status,
        ]);
        return new RetoursResource($retour);
    }

    public function retourbybonid($id)
    {
        $retours_ids = DB::table('bon_retour')->where('bon_id', $id)->pluck('retour_id');
        $retours = DB::table('retours')->whereIn('id', $retours_ids)->get();
        return RetoursResource::collection($retours);
    }

    public function completedretours()
    {
        $retours = DB::table('retours')
            ->where('status', 'C')
            ->count();
        return $retours;
    }
    public function initialretours()
    {
        $retours = DB::table('retours')
            ->where('status', 'A')
            ->count();

        return $retours;
    }

    public function inprogresretours()
    {
        $retours = DB::table('retours')
            ->where('status', 'B')
            ->count();

        return $retours;
    }

    public function retoursbyproduct()
    {
        $retoursByProduct = DB::table('retours')
            ->join('products', 'retours.product_id', '=', 'products.id')
            ->join('prodnames', 'products.name_id', '=', 'prodnames.id')
            ->select('prodnames.name as prodname', DB::raw('count(retours.id) as total_retours'))
            ->groupBy('prodname')
            ->get();

        return response()->json($retoursByProduct);
    }

    public function retoursbypiece()
    {
        $retoursByPiece = DB::table('piece_issue_reteur')
            ->join('pieces', 'piece_issue_reteur.piece_id', '=', 'pieces.id')
            ->join('retours', 'piece_issue_reteur.retour_id', '=', 'retours.id')
            ->select('pieces.name as piecesname', DB::raw('count(retours.id) as total_retours'))
            ->groupBy('piecesname')
            ->get();

        return response()->json($retoursByPiece);
    }

    public function retoursbyissue()
    {
        $retoursByIssue = DB::table('piece_issue_reteur')
            ->join('pieces', 'piece_issue_reteur.piece_id', '=', 'pieces.id')
            ->join('issues', 'piece_issue_reteur.issue_id', '=', 'issues.id')
            ->select(
                'pieces.name as piece_name',
                'issues.description as issue_description',
                DB::raw('count(issues.id) as total_issues')
            )
            ->groupBy('piece_name', 'issue_description')
            ->get();

        return response()->json($retoursByIssue);
    }

    public function retoursbydist()
    {
        $retoursByDist = DB::table('retours')
            ->join('products', 'retours.product_id', '=', 'products.id')
            ->join('distributeurs', 'products.dist_id', '=', 'distributeurs.id')
            ->join('users', 'distributeurs.user_id', '=', 'users.id')
            ->select(
                'users.name as dist_name',
                DB::raw('count(retours.id) as total_retours')
            )
            ->groupBy('dist_name')
            ->get();

        return response()->json($retoursByDist);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Retour $retour)
    {
        $retour->delete();
    }
}
