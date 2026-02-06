<?php

namespace App\Http\Controllers\Api;

use App\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|string|min:6',
                'phone' => 'nullable|string',
                'role' => 'nullable|string',
            ]);

            $user = $this->authService->register(
                $validated['name'],
                $validated['email'],
                $validated['password'],
                $validated['phone'],
                $validated['role'] ?? 'Customer'
            );

            return response()->json([
                'message' => 'User registered successfully',
                'data' => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = $this->authService->login($validated['email'], $validated['password']);

            return response()->json([
                'message' => 'Login successful',
                'data' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    public function getCurrentUser(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
            
            $userData = User::with('role')->find($user->id);

            return response()->json([
                'message' => 'User fetched successfully',
                'data' => [
                    'id' => $userData->id,
                    'name' => $userData->name,
                    'email' => $userData->email,
                    'phone_number' => $userData->phone_number,
                    'role' => $userData->role->name,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
