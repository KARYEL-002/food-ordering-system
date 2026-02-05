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
                'name' => 'required|string',
                'description' => 'nullable|string',
                'price' => 'required|numeric',
                'image_url' => 'nullable|string',
            ]);

            $item = $this->menuItemService->createMenuItem(
                $validated['name'],
                $validated['description'] ?? null,
                $validated['price'],
                $validated['image_url'] ?? null
            );

            return response()->json([
                'message' => 'Menu item created successfully',
                'data' => $item,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'price' => 'required|numeric',
                'image_url' => 'nullable|string',
                'availability_status' => 'nullable|boolean',
            ]);

            $item = $this->menuItemService->updateMenuItem(
                $id,
                $validated['name'],
                $validated['description'] ?? null,
                $validated['price'],
                $validated['image_url'] ?? null,
                $validated['availability_status'] ?? true
            );

            return response()->json([
                'message' => 'Menu item updated successfully',
                'data' => $item,
            ], 200);
        } catch (\Exception $e) {
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
