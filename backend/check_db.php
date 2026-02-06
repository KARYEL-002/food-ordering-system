<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\MenuItem;

try {
    $count = MenuItem::count();
    echo "Total menu items in database: $count\n";
    
    $items = MenuItem::latest()->limit(5)->get(['id', 'name', 'price', 'image_url', 'created_at']);
    
    echo "\n=== Latest 5 Menu Items ===\n";
    foreach ($items as $item) {
        echo "ID: {$item->id}, Name: {$item->name}, Price: {$item->price}, Image: {$item->image_url}, Created: {$item->created_at}\n";
    }
    
    if ($count === 0) {
        echo "\n❌ No menu items in database!\n";
    } else {
        echo "\n✅ Found $count menu items\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
