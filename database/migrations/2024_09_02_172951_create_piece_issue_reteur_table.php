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
        Schema::create('piece_issue_reteur', function (Blueprint $table) {
            $table->id();
            $table->foreignId('retour_id')->constrained()->onDelete('cascade');
            $table->foreignId('piece_id')->constrained()->onDelete('cascade');
            $table->foreignId('issue_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('piece_issue_reteur');
    }
};
