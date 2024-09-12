<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modal extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function prodnames()
    {
        return $this->hasMany(Prodname::class);
    }
}
