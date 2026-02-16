<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->string('delivery_service')->nullable()->after('delivery_type');
            $table->decimal('delivery_fee', 10, 2)->default(0)->after('delivery_service');
        });
    }

    public function down(): void
    {
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropColumn(['delivery_service', 'delivery_fee']);
        });
    }
};
