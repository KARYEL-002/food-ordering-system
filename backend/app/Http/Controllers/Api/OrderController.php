<?php

namespace App\Http\Controllers\Api;

use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.menu_item_id' => 'required|integer',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric',
                'subtotal' => 'required|numeric',
                'tax_amount' => 'required|numeric',
                'total_amount' => 'required|numeric',
                'payment_method' => 'required|string',
                'status' => 'nullable|string',
                'payment_status' => 'nullable|string',
                'order_detail' => 'nullable|array',
                'order_detail.delivery_type' => 'nullable|string',
                'order_detail.order_date' => 'nullable|date',
                'order_detail.order_time' => 'nullable|date_format:H:i',
                'order_detail.delivery_address' => 'nullable|string',
            ]);

            $order = $this->orderService->createOrder($request->user()->id, $validated['items'], $validated);

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order->load('items.menuItem', 'details'),
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show($id, Request $request)
    {
        try {
            $order = $this->orderService->getOrderById($id);

            // Check authorization
            if ($request->user()->role->name !== 'Admin' && $order->user_id !== $request->user()->id) {
                return response()->json(['error' => 'Not authorized to view this order'], 403);
            }

            return response()->json([
                'message' => 'Order retrieved successfully',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function userOrders(Request $request)
    {
        try {
            $orders = $this->orderService->getUserOrders($request->user()->id);

            return response()->json([
                'message' => 'User orders retrieved successfully',
                'data' => $orders,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $orders = $this->orderService->getAllOrders();

            return response()->json([
                'message' => 'All orders retrieved successfully',
                'data' => $orders,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'nullable|string',
                'payment_status' => 'nullable|string',
            ]);

            $order = $this->orderService->updateOrder($id, $validated);

            return response()->json([
                'message' => 'Order updated successfully',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function getTodayRevenue()
    {
        try {
            $today = now()->startOfDay();
            $tomorrow = now()->endOfDay();

            $revenue = \App\Models\Order::whereBetween('created_at', [$today, $tomorrow])
                ->sum('total_amount');

            return response()->json([
                'message' => 'Today revenue retrieved successfully',
                'data' => [
                    'total' => (float) $revenue,
                    'date' => now()->format('Y-m-d'),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $order = \App\Models\Order::findOrFail($id);
            $order->items()->delete();
            $order->details()->delete();
            $order->delete();

            return response()->json([
                'message' => 'Order deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
