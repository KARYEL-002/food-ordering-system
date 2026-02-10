<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            // Update the default to 10 instead of 999
            // This requires adjusting the column definition
        });

        // Set all existing items to have quantity_available = 10
        \DB::table('menu_items')->update(['quantity_available' => 10]);
    }

    public function down(): void
    {
        // Revert to 999
        \DB::table('menu_items')->update(['quantity_available' => 999]);
    }
};
