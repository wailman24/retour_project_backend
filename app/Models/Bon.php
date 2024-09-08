<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bon extends Model
{
    use HasFactory;
    protected $fillable = ['dist_id'];
    public function retours()
    {
        return $this->belongsToMany(Retour::class, 'bon_retour', 'bon_id', 'retour_id');
    }

    public function distributeurs()
    {
        return $this->belongsTo(Distributeur::class);
    }
}
