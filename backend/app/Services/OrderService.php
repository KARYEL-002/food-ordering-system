<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;

class OrderService
{
    public function createOrder($userId, $items)
    {
        if (empty($items)) {
            throw new \Exception('Order must contain at least one item');
        }

        $totalAmount = 0;

        // Validate items and calculate total
        foreach ($items as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            if (!$menuItem) {
                throw new \Exception("Menu item {$item['menu_item_id']} not found");
            }

            if (!$menuItem->availability_status) {
                throw new \Exception("Menu item {$menuItem->name} is not available");
            }

            $totalAmount += $menuItem->price * $item['quantity'];
        }

        // Create order
        $order = Order::create([
            'user_id' => $userId,
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);

        // Add order items
        foreach ($items as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $menuItem->price,
            ]);
        }

        return $order;
    }

    public function getOrderById($orderId)
    {
        $order = Order::with('items.menuItem')->find($orderId);
        if (!$order) {
            throw new \Exception('Order not found');
        }
        return $order;
    }

    public function getUserOrders($userId)
    {
        return Order::where('user_id', $userId)
            ->with('items.menuItem')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getAllOrders()
    {
        return Order::with('items.menuItem', 'user')->orderByDesc('created_at')->get();
    }

    public function updateOrderStatus($orderId, $status)
    {
        $validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!in_array($status, $validStatuses)) {
            throw new \Exception('Invalid order status');
        }

        $order = Order::find($orderId);
        if (!$order) {
            throw new \Exception('Order not found');
        }

        $order->update(['status' => $status]);
        return $order;
    }
}
