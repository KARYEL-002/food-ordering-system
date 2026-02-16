<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles (use firstOrCreate to avoid duplicates)
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $customerRole = Role::firstOrCreate(['name' => 'Customer']);

        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@foodhub.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'phone_number' => '09171234567',
            ]
        );

        // Note: removed sample customer seeding to keep only the admin as default

        // Create sample menu items
        $menuItems = [
            // MAIN DISHES
            ['name' => 'Adobo (Chicken)', 'description' => 'Tender chicken cooked in vinegar and garlic sauce', 'price' => 180.00, 'image_url' => '/images/adobo.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Adobo (Pork)', 'description' => 'Juicy pork cooked in vinegar and garlic sauce', 'price' => 200.00, 'image_url' => '/images/adobo.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Sinigang (Pork)', 'description' => 'Pork in tamarind-flavored stew with vegetables', 'price' => 220.00, 'image_url' => '/images/sinigang.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Sinigang (Shrimp)', 'description' => 'Fresh shrimp in tamarind-flavored stew with vegetables', 'price' => 240.00, 'image_url' => '/images/sinigang.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Sinigang (Fish)', 'description' => 'Fresh fish in tamarind-flavored stew with vegetables', 'price' => 230.00, 'image_url' => '/images/sinigang.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Kare-Kare', 'description' => 'Meat and vegetables in peanut sauce', 'price' => 250.00, 'image_url' => '/images/karekare.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Lechon Kawali', 'description' => 'Deep fried pork belly with crispy skin', 'price' => 280.00, 'image_url' => '/images/lechon-kawali.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            ['name' => 'Tinola', 'description' => 'Chicken soup with ginger and vegetables', 'price' => 180.00, 'image_url' => '/images/tinola.png', 'category' => 'Main Dishes', 'quantity_available' => 10],
            
            // SOUPS
            ['name' => 'Bulalo', 'description' => 'Beef marrow soup with vegetables', 'price' => 150.00, 'image_url' => '/images/bulalo.png', 'category' => 'Soup', 'quantity_available' => 10],
            ['name' => 'Batchoy', 'description' => 'Noodle soup with pork and offal', 'price' => 120.00, 'image_url' => '/images/batchoy.png', 'category' => 'Soup', 'quantity_available' => 10],
            ['name' => 'Sopas', 'description' => 'Creamy noodle soup with meat and vegetables', 'price' => 100.00, 'image_url' => '/images/sopas.png', 'category' => 'Soup', 'quantity_available' => 10],
            
            // SILOG (Fried Rice + Egg + Meat)
            ['name' => 'Tapsilog', 'description' => 'Dried beef, fried rice, and egg', 'price' => 150.00, 'image_url' => '/images/tapsilog.png', 'category' => 'Silog', 'quantity_available' => 10],
            ['name' => 'Tocilog', 'description' => 'Sweet cured pork, fried rice, and egg', 'price' => 140.00, 'image_url' => '/images/tocilog.png', 'category' => 'Silog', 'quantity_available' => 10],
            ['name' => 'Longsilog', 'description' => 'Longanisa sausage, fried rice, and egg', 'price' => 130.00, 'image_url' => '/images/longsilog.png', 'category' => 'Silog', 'quantity_available' => 10],
            ['name' => 'Hotsilog', 'description' => 'Hot dog, fried rice, and egg', 'price' => 120.00, 'image_url' => '/images/hotsilog.png', 'category' => 'Silog', 'quantity_available' => 10],
            
            // SNACKS
            ['name' => 'Lumpiang Shanghai', 'description' => 'Fried spring rolls with pork and vegetables', 'price' => 80.00, 'image_url' => '/images/lumpiang-shanghai.png', 'category' => 'Snacks', 'quantity_available' => 10],
            ['name' => 'Siomai', 'description' => 'Filipino-style steamed dumplings with meat filling', 'price' => 90.00, 'image_url' => '/images/siomai.png', 'category' => 'Snacks', 'quantity_available' => 10],
            ['name' => 'Fish Ball', 'description' => 'Fried fish balls with sweet and spicy sauce', 'price' => 60.00, 'image_url' => '/images/fishball.png', 'category' => 'Snacks', 'quantity_available' => 10],
            ['name' => 'Kwek-Kwek', 'description' => 'Battered and fried quail eggs', 'price' => 70.00, 'image_url' => '/images/kwek-kwek.png', 'category' => 'Snacks', 'quantity_available' => 10],
            ['name' => 'Isaw', 'description' => 'Grilled chicken intestines with sauce', 'price' => 100.00, 'image_url' => '/images/isaw.png', 'category' => 'Snacks', 'quantity_available' => 10],
            ['name' => 'Turon', 'description' => 'Fried banana and brown sugar wrapped in spring roll wrapper', 'price' => 60.00, 'image_url' => '/images/turon.png', 'category' => 'Snacks', 'quantity_available' => 10],
            
            // DESSERTS (Kakanin & Sweets)
            ['name' => 'Leche Flan', 'description' => 'Creamy caramelized custard dessert', 'price' => 80.00, 'image_url' => '/images/leche-flan.png', 'category' => 'Desserts', 'quantity_available' => 10],
            ['name' => 'Halo-Halo', 'description' => 'Mixed shaved ice with fruits, beans, and evaporated milk', 'price' => 100.00, 'image_url' => '/images/halo-halo.png', 'category' => 'Desserts', 'quantity_available' => 10],
            ['name' => 'Biko', 'description' => 'Sticky rice cake with coconut milk topping', 'price' => 60.00, 'image_url' => '/images/biko.png', 'category' => 'Desserts', 'quantity_available' => 10],
            ['name' => 'Pichi-Pichi', 'description' => 'Steamed rice cake with cheese and sugar coating', 'price' => 50.00, 'image_url' => '/images/pichi-pichi.png', 'category' => 'Desserts', 'quantity_available' => 10],
        ];

        foreach ($menuItems as $item) {
            MenuItem::firstOrCreate(
                ['name' => $item['name']],
                array_merge($item, ['availability_status' => true])
            );
        }
    }
}
