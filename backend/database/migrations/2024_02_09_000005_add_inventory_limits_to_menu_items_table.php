<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            // Add quantity available field
            $table->integer('quantity_available')->default(999)->comment('Available quantity for this menu item');
            
            // Add max order per customer field
            $table->integer('max_order_per_customer')->default(10)->comment('Maximum quantity a customer can order per transaction');
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['quantity_available', 'max_order_per_customer']);
        });
    }
};
