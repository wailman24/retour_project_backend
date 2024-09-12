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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('name_id');
            $table->string('Imei')->unique();
            $table->unsignedBigInteger('dist_id')->nullable();

            $table->foreign('name_id')->references('id')->on('prodnames')->onDelete('cascade');
            $table->foreign('dist_id')->references('id')->on('distributeurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
