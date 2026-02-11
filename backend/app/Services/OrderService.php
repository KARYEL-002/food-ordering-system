<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderDetail;
use App\Models\MenuItem;
use App\Models\Payment;

class OrderService
{
    public function createOrder($userId, $items, $orderData = [])
    {
        if (empty($items)) {
            throw new \Exception('Order must contain at least one item');
        }

        // Validate items
        foreach ($items as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            if (!$menuItem) {
                throw new \Exception("Menu item {$item['menu_item_id']} not found");
            }

            if (!$menuItem->availability_status) {
                throw new \Exception("Menu item {$menuItem->name} is not available");
            }
        }

        // Create order with payment info
        $order = Order::create([
            'user_id' => $userId,
            'subtotal' => $orderData['subtotal'] ?? 0,
            'tax_amount' => $orderData['tax_amount'] ?? 0,
            'total_amount' => $orderData['total_amount'] ?? 0,
            'status' => $orderData['status'] ?? 'pending',
            'payment_method' => $orderData['payment_method'] ?? 'cash',
            'payment_status' => $orderData['payment_status'] ?? 'pending',
        ]);

        // Create payment record
        $paymentData = [
            'order_id' => $order->id,
            'payment_method' => $orderData['payment_method'] ?? 'cash',
            'amount' => $orderData['total_amount'] ?? 0,
            'payment_status' => $orderData['payment_status'] ?? 'pending',
            'payment_date' => now(),
        ];

        // Add transaction reference if provided (for GCash and online payments)
        if (!empty($orderData['gcash_reference'])) {
            $paymentData['transaction_reference'] = $orderData['gcash_reference'];
        }

        Payment::create($paymentData);

        // Add order items and decrease inventory
        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'] ?? MenuItem::find($item['menu_item_id'])->price,
            ]);

            // Decrease quantity_available and auto-mark as unavailable if sold out
            $menuItem = MenuItem::find($item['menu_item_id']);
            $remainingQuantity = $menuItem->quantity_available - $item['quantity'];
            
            $updateData = ['quantity_available' => max(0, $remainingQuantity)];
            
            // Auto-mark as unavailable if stock reaches 0
            if ($remainingQuantity <= 0) {
                $updateData['availability_status'] = false;
            }
            
            $menuItem->update($updateData);
        }

        // Create order detail if provided
        if (!empty($orderData['order_detail'])) {
            OrderDetail::create([
                'order_id' => $order->id,
                'delivery_type' => $orderData['order_detail']['delivery_type'] ?? 'delivery',
                'order_date' => $orderData['order_detail']['order_date'] ?? now()->toDateString(),
                'order_time' => $orderData['order_detail']['order_time'] ?? now()->toTimeString(),
                'delivery_address' => $orderData['order_detail']['delivery_address'] ?? null,
            ]);
        }

        return $order;
    }

    public function getOrderById($orderId)
    {
        $order = Order::with('items.menuItem', 'details', 'payment')->find($orderId);
        if (!$order) {
            throw new \Exception('Order not found');
        }
        return $order;
    }

    public function getUserOrders($userId)
    {
        return Order::where('user_id', $userId)
            ->with('items.menuItem', 'details', 'payment')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getAllOrders()
    {
        return Order::with('items.menuItem', 'user', 'details', 'payment')->orderByDesc('created_at')->get();
    }

    public function updateOrderStatus($orderId, $status)
    {
        $validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
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

    public function cancelOrder($orderId)
    {
        $order = Order::find($orderId);
        if (!$order) {
            throw new \Exception('Order not found');
        }

        // Only allow cancellation if order is pending, confirmed, or preparing
        $cancellableStatuses = ['pending', 'confirmed', 'preparing'];
        if (!in_array($order->status, $cancellableStatuses)) {
            throw new \Exception('Only ' . implode(', ', $cancellableStatuses) . ' orders can be cancelled');
        }

        $order->update(['status' => 'cancelled']);
        return $order;
    }

    public function updateOrder($orderId, $data)
    {
        $order = Order::find($orderId);
        if (!$order) {
            throw new \Exception('Order not found');
        }

        $updateData = [];
        
        if (isset($data['status'])) {
            $validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
            if (!in_array($data['status'], $validStatuses)) {
                throw new \Exception('Invalid order status');
            }
            $updateData['status'] = $data['status'];
        }

        if (isset($data['payment_status'])) {
            $validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
            if (!in_array($data['payment_status'], $validPaymentStatuses)) {
                throw new \Exception('Invalid payment status');
            }
            $updateData['payment_status'] = $data['payment_status'];
        }

        if (empty($updateData)) {
            throw new \Exception('No valid fields to update');
        }

        $order->update($updateData);
        return $order;
    }
}
