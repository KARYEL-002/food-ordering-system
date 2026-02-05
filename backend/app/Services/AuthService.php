<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function register($name, $email, $password, $phoneNumber, $roleName = 'Customer')
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
            'id' => $user->id,
            'email' => $user->email,
            'token' => $token,
        ];
    }

    public function login($email, $password)
    {
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            throw new \Exception('Invalid credentials');
        }

        $user = User::with('role')->where('email', $email)->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->name,
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
