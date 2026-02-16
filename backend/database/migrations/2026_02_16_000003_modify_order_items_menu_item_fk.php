<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Drop existing foreign key if present
            if (Schema::hasColumn('order_items', 'menu_item_id')) {
                // Attempt to drop foreign key constraints safely
                try {
                    $table->dropForeign(['menu_item_id']);
                } catch (\Exception $e) {
                    // ignore if constraint doesn't exist
                }

                // Make column nullable so we can keep order item records after menu item deletion
                $table->unsignedBigInteger('menu_item_id')->nullable()->change();

                // Re-add foreign key with SET NULL on delete
                $table->foreign('menu_item_id')->references('id')->on('menu_items')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            try {
                $table->dropForeign(['menu_item_id']);
            } catch (\Exception $e) {
            }

            // Make column not nullable and restore cascade delete
            $table->unsignedBigInteger('menu_item_id')->nullable(false)->change();
            $table->foreign('menu_item_id')->references('id')->on('menu_items')->onDelete('cascade');
        });
    }
};
