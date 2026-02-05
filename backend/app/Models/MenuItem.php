<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image_url', 'category', 'availability_status'];
    protected $casts = ['availability_status' => 'boolean'];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
