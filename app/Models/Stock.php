<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;
    protected $fillable = ['piece_id', 'qte'];

    public function pieces()
    {
        return $this->belongsTo(Piece::class);
    }
}
