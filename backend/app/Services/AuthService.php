<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function register($name, $email, $password, $phoneNumber = null, $roleName = 'Customer')
    {
        // Check if user exists
        if (User::where('email', $email)->exists()) {
            throw new \Exception('User with this email already exists');
        }

        // Get or create role
        $role = \App\Models\Role::where('name', $roleName)->first();
        if (!$role) {
            $role = \App\Models\Role::create(['name' => $roleName]);
        }

        // Create user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'phone_number' => $phoneNumber,
            'role_id' => $role->id,
        ]);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'role' => $role->name,
            ],
            'token' => $token,
        ];
    }

    public function login($email, $password)
    {
        // Try to find the user first
        $user = User::where('email', $email)->first();
        
        if (!$user || !Hash::check($password, $user->password)) {
            throw new \Exception('Invalid credentials');
        }

        // Load the role relationship
        $user->load('role');
        
        // Create API token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'role' => $user->role->name,
            ],
            'token' => $token,
        ];
    }

    public function getUserById($id)
    {
        $user = User::with('role')->find($id);
        if (!$user) {
            throw new \Exception('User not found');
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->name,
        ];
    }
}
