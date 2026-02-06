<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropColumn(['party_size', 'table_number', 'delivery_instructions']);
        });
    }

    public function down(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->integer('party_size')->nullable();
            $table->string('table_number')->nullable();
            $table->text('delivery_instructions')->nullable();
        });
    }
};
