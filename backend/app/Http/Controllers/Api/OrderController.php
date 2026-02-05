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
            ]);

            $order = $this->orderService->createOrder($request->user()->id, $validated['items']);

            return response()->json([
                'message' => 'Order created successfully',
                'data' => $order->load('items.menuItem'),
            ], 201);
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
                'status' => 'required|string',
            ]);

            $order = $this->orderService->updateOrderStatus($id, $validated['status']);

            return response()->json([
                'message' => 'Order status updated successfully',
                'data' => $order,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
