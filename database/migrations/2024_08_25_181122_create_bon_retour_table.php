<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bon_retour', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bon_id');
            $table->unsignedBigInteger('retour_id');
            $table->timestamps();

            $table->foreign('bon_id')->references('id')->on('bons')->onDelete('cascade');
            $table->foreign('retour_id')->references('id')->on('retours')->onDelete('cascade');

            $table->unique(['bon_id', 'retour_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bon_retour');
    }
};
