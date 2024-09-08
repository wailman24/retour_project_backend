<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'Imei', 'modal_id'];

    public function modals()
    {
        return $this->belongsTo(Modal::class);
    }

    public function pieces()
    {
        return $this->hasMany(Piece::class);
    }

    public function retours()
    {
        return $this->hasMany(Retour::class);
    }
    public function distributeurs()
    {
        return $this->belongsTo(Distributeur::class);
    }
}
