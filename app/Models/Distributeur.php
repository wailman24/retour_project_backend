<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Distributeur extends Model
{
    use HasFactory;

    protected $fillable = ['location', 'user_id'];

    public function users()
    {
        return $this->belongsTo(User::class);
    }

    public function bons()
    {
        return $this->hasMany(Bon::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
