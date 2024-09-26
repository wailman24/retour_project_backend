<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Magazine extends Model
{
    use HasFactory;

    protected $fillable = ['piece_id', 'quantity'];

    public function pieces()
    {
        return $this->belongsTo(Piece::class);
    }
}
