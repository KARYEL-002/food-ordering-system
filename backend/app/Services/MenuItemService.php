<?php

namespace App\Services;

use App\Models\MenuItem;

class MenuItemService
{
    public function createMenuItem($name, $description, $price, $imageUrl)
    {
        if (!$name || !$price) {
            throw new \Exception('Name and price are required');
        }

        return MenuItem::create([
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_url' => $imageUrl,
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

    public function updateMenuItem($id, $name, $description, $price, $imageUrl, $availabilityStatus)
    {
        $item = MenuItem::find($id);
        if (!$item) {
            throw new \Exception('Menu item not found');
        }

        $item->update([
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_url' => $imageUrl,
            'availability_status' => $availabilityStatus,
        ]);

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
