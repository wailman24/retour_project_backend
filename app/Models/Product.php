<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name_id', 'Imei', 'dist_id'];


    public function prodnames()
    {
        return $this->belongsTo(Prodname::class);
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
