<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retour extends Model
{
    use HasFactory;


    protected $fillable = ['guarante', 'status', 'name', 'product_id'];

    public function products()
    {
        return $this->belongsTo(Product::class);
    }

    /*     public function issues()
    {
        return $this->belongsToMany(Issue::class, 'issue_retour', 'retour_id', 'issue_id')->withPivot('piece_id');
    } */

    public function pieces()
    {
        return $this->belongsToMany(Piece::class, 'piece_issue_reteur')
            ->withPivot('issue_id');
    }

    public function bons()
    {
        return $this->belongsToMany(Bon::class, 'bon_retour', 'retour_id', 'bon_id');
    }
}
