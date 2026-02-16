<?php

namespace App\Http\Controllers\Api;

use App\Services\MenuItemService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class MenuItemController extends Controller
{
    protected $menuItemService;

    public function __construct(MenuItemService $menuItemService)
    {
        $this->menuItemService = $menuItemService;
    }

    public function index()
    {
        try {
            $items = $this->menuItemService->getAllMenuItems();

            return response()->json([
                'message' => 'Menu items retrieved successfully',
                'data' => $items,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $item = $this->menuItemService->getMenuItemById($id);

            return response()->json([
                'message' => 'Menu item retrieved successfully',
                'data' => $item,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:menu_items,name',
                'category' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'availability_status' => 'nullable|in:0,1,true,false',
                'quantity_available' => 'nullable|integer|min:0',
                'max_order_per_customer' => 'nullable|integer|min:1',
            ]);

            $imageUrl = null;
            if ($request->hasFile('image')) {
                $imageUrl = $this->menuItemService->storeImage($request->file('image'));
            }

            // Convert to actual boolean
            $availabilityStatus = true;
            if (isset($validated['availability_status'])) {
                $availabilityStatus = filter_var($validated['availability_status'], FILTER_VALIDATE_BOOLEAN);
            }

            $item = $this->menuItemService->createMenuItem(
                $validated['name'],
                $validated['description'] ?? null,
                $validated['price'],
                $imageUrl,
                $validated['category'] ?? null,
                $availabilityStatus,
                $validated['quantity_available'] ?? 10,
                $validated['max_order_per_customer'] ?? 10
            );

            return response()->json([
                'message' => 'Menu item created successfully',
                'data' => $item,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 400);
        } catch (\Exception $e) {
            \Log::error('Menu item creation error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:menu_items,name,' . $id,
                'category' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'image_url' => 'nullable|string',
                'availability_status' => 'nullable|in:0,1,true,false',
                'quantity_available' => 'nullable|integer|min:0',
                'max_order_per_customer' => 'nullable|integer|min:1',
            ]);

            $item = $this->menuItemService->getMenuItemById($id);
            $imageUrl = $item->image_url; // Keep existing image by default

            // Check if new image file is uploaded
            if ($request->hasFile('image')) {
                $imageUrl = $this->menuItemService->storeImage($request->file('image'));
            } elseif (isset($validated['image_url'])) {
                // Use provided image URL if specified
                $imageUrl = $validated['image_url'];
            }

            // Convert to actual boolean
            $availabilityStatus = $item->availability_status; // Keep existing status by default
            if (isset($validated['availability_status'])) {
                $availabilityStatus = filter_var($validated['availability_status'], FILTER_VALIDATE_BOOLEAN);
            }

            $updatedItem = $this->menuItemService->updateMenuItem(
                $id,
                $validated['name'],
                $validated['description'] ?? $item->description,
                $validated['price'],
                $imageUrl,
                $validated['category'] ?? $item->category,
                $availabilityStatus,
                $validated['quantity_available'] ?? $item->quantity_available,
                $validated['max_order_per_customer'] ?? $item->max_order_per_customer
            );

            return response()->json([
                'message' => 'Menu item updated successfully',
                'data' => $updatedItem,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 400);
        } catch (\Exception $e) {
            \Log::error('Menu item update error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $result = $this->menuItemService->deleteMenuItem($id);

            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
