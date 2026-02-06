<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained('orders')->onDelete('cascade');
            $table->string('payment_method'); // cash, online, card, etc
            $table->decimal('amount', 10, 2);
            $table->string('payment_status')->default('pending'); // pending, completed, failed, refunded
            $table->string('transaction_reference')->nullable(); // For online payments
            $table->text('payment_notes')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
