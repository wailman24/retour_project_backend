<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodname extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'modal_id'];

    public function modals()
    {
        return $this->belongsTo(Modal::class);
    }
    public function pieces()
    {
        return $this->hasMany(Piece::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
