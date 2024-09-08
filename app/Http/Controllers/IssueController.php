<?php

namespace App\Http\Controllers;

use App\Http\Resources\IssuesResource;
use App\Models\Issue;
use App\Models\Piece;
use Illuminate\Http\Request;

class IssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return IssuesResource::collection(Issue::all());
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
            //'piece_id' => 'required',
            'description' => 'required'
        ]);

        $issue = Issue::create([
            //'piece_id' => $request->piece_id,
            'description' => $request->description
        ]);

        return new IssuesResource($issue);
    }

    /**
     * Display the specified resource.
     */
    public function show(Issue $issue)
    {
        return new IssuesResource($issue);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Issue $issue)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Issue $issue)
    {
        $request->validate([
            //'piece_id' => 'required',
            'description' => 'required'
        ]);
        $issue->update([
            //'piece_id' => $request->piece_id,
            'description' => $request->description
        ]);

        return new IssuesResource($issue);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Issue $issue)
    {
        $issue->delete();
        //$piece = Piece::find($issue->piece_id);
        /* return response()->json([
            'message' => 'the issue of the ' . $piece->name . ' piece and ' . $issue->description . ' description has deleted'
        ]); */
    }
}
