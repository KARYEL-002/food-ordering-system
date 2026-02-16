<?php

namespace App\Services;

use App\Models\MenuItem;

class MenuItemService
{
    public function storeImage($file)
    {
        if (!$file) {
            return null;
        }

        try {
            // Store the file in storage/app/public/menu-items subdirectory
            $path = $file->store('menu-items', 'public');
            
            // $path is relative to storage/app/public/ (e.g., 'menu-items/filename.png')
            // Return the public/storage URL path (served directly by web server)
            return '/storage/' . $path;
        } catch (\Exception $e) {
            \Log::error('Image upload failed: ' . $e->getMessage());
            throw new \Exception('Failed to upload image: ' . $e->getMessage());
        }
    }

    public function createMenuItem($name, $description, $price, $imageUrl, $category = null, $availabilityStatus = true, $quantityAvailable = 10, $maxOrderPerCustomer = 10)
    {
        if (!$name || !$price) {
            throw new \Exception('Name and price are required');
        }

        return MenuItem::create([
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_url' => $imageUrl,
            'category' => $category,
            'availability_status' => $availabilityStatus,
            'quantity_available' => $quantityAvailable,
            'max_order_per_customer' => $maxOrderPerCustomer,
        ]);
    }

    public function getAllMenuItems()
    {
        return MenuItem::all();
    }

    public function getMenuItemById($id)
    {
        $item = MenuItem::find($id);
        if (!$item) {
            throw new \Exception('Menu item not found');
        }
        return $item;
    }

    public function updateMenuItem($id, $name, $description, $price, $imageUrl, $category = null, $availabilityStatus = true, $quantityAvailable = null, $maxOrderPerCustomer = null)
    {
        $item = MenuItem::find($id);
        if (!$item) {
            throw new \Exception('Menu item not found');
        }

        $updateData = [
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_url' => $imageUrl,
            'category' => $category,
            'availability_status' => $availabilityStatus,
        ];

        // Only update inventory fields if provided
        if ($quantityAvailable !== null) {
            $updateData['quantity_available'] = $quantityAvailable;
        }
        if ($maxOrderPerCustomer !== null) {
            $updateData['max_order_per_customer'] = $maxOrderPerCustomer;
        }

        $item->update($updateData);

        return $item;
    }

    public function deleteMenuItem($id)
    {
        $item = MenuItem::find($id);
        if (!$item) {
            throw new \Exception('Menu item not found');
        }

        $item->delete();
        return ['message' => 'Menu item deleted successfully'];
    }
}
