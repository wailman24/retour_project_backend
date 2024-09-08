<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Issue extends Model
{
    use HasFactory;
    protected $fillable = ['description'];

    /*  public function pieces()
    {
        return $this->HasOne(Piece::class);
    }
 */
    /*   public function retours()
    {
        return $this->belongsToMany(Retour::class, 'issue_retour', 'issue_id', 'retour_id')->withPivot('piece_id');
    } */
    public function pieces()
    {
        return $this->belongsToMany(Piece::class, 'piece_issue_reteur');
    }
}
