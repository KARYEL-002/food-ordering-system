<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'order_details';

    protected $fillable = [
        'order_id',
        'delivery_type',
        'delivery_service',
        'delivery_fee',
        'customer_name',
        'customer_phone',
        'order_date',
        'order_time',
        'estimated_delivery_time',
        'delivery_address',
    ];

    protected $casts = [
        'order_date' => 'date',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
