<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            
            // Delivery Type and Details
            $table->string('delivery_type'); // dine_in, pickup, delivery
            $table->string('customer_name');
            $table->string('customer_phone');
            
            // Date and Time
            $table->date('order_date');
            $table->time('order_time');
            $table->time('estimated_delivery_time')->nullable();
            
            // Dine-in specific
            $table->integer('party_size')->nullable();
            $table->string('table_number')->nullable();
            
            // Delivery specific
            $table->text('delivery_address')->nullable();
            $table->text('delivery_instructions')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
