<?php

namespace App\Services;

use App\Models\User;
use App\Exceptions\LoginException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AuthService
{
    // Login security constants
    private const MAX_ATTEMPTS = 3;
    private const FIRST_LOCKOUT_TIME = 300; // 5 minutes in seconds
    private const SECOND_LOCKOUT_TIME = 300; // 5 minutes in seconds
    private const ATTEMPT_DECAY_TIME = 300; // Reset attempts after 5 minutes of inactivity

    private function getFailedAttemptsKey($email)
    {
        return "login_attempts:{$email}";
    }

    private function getLockoutKey($email)
    {
        return "login_lockout:{$email}";
    }

    private function getLockoutLevelKey($email)
    {
        return "login_lockout_level:{$email}";
    }

    private function isLockedOut($email)
    {
        return Cache::has($this->getLockoutKey($email));
    }

    private function getFailedAttempts($email)
    {
        return Cache::get($this->getFailedAttemptsKey($email), 0);
    }

    private function getLockoutLevel($email)
    {
        return Cache::get($this->getLockoutLevelKey($email), 0);
    }

    private function incrementFailedAttempts($email)
    {
        $attempts = $this->getFailedAttempts($email);
        Cache::put($this->getFailedAttemptsKey($email), $attempts + 1, self::ATTEMPT_DECAY_TIME);

        if ($this->getFailedAttempts($email) >= self::MAX_ATTEMPTS) {
            $lockoutLevel = $this->getLockoutLevel($email);
            
            // Determine lockout duration based on level
            if ($lockoutLevel === 0) {
                // First lockout: 5 minutes
                $lockoutTime = self::FIRST_LOCKOUT_TIME;
                Cache::put($this->getLockoutLevelKey($email), 1, 3600); // Remember level for 1 hour
            } else {
                // Second lockout: 10 minutes
                $lockoutTime = self::SECOND_LOCKOUT_TIME;
            }
            
            Cache::put($this->getLockoutKey($email), true, $lockoutTime);
        }
    }

    private function clearFailedAttempts($email)
    {
        Cache::forget($this->getFailedAttemptsKey($email));
        Cache::forget($this->getLockoutKey($email));
    }

    private function getRemainingAttempts($email)
    {
        return max(0, self::MAX_ATTEMPTS - $this->getFailedAttempts($email));
    }

    private function getLockoutTimeRemaining($email)
    {
        if (!Cache::has($this->getLockoutKey($email))) {
            return 0;
        }
        
        // For file cache, we need to estimate the remaining time
        // Get the lockout level to determine which timeout it used
        $lockoutLevel = $this->getLockoutLevel($email);
        
        // Return the appropriate lockout duration
        // In a production environment with Redis, you'd use TTL
        return $lockoutLevel === 0 ? self::FIRST_LOCKOUT_TIME : self::SECOND_LOCKOUT_TIME;
    }
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
        // Check if account is locked
        if ($this->isLockedOut($email)) {
            $lockoutTimeRemaining = $this->getLockoutTimeRemaining($email);
            $minutes = ceil($lockoutTimeRemaining / 60);
            $seconds = $lockoutTimeRemaining % 60;
            
            throw new LoginException(
                "Too many failed login attempts. Please try again in {$minutes} minute" . ($minutes !== 1 ? 's' : ''),
                'account_locked',
                [
                    'minutesRemaining' => $minutes,
                    'secondsRemaining' => $seconds,
                ]
            );
        }

        // Try to find the user first
        $user = User::where('email', $email)->first();
        
        if (!$user || !Hash::check($password, $user->password)) {
            // Increment failed attempts on invalid credentials
            $this->incrementFailedAttempts($email);
            
            $remainingAttempts = $this->getRemainingAttempts($email);
            
            if ($remainingAttempts === 0) {
                // Account just got locked
                $lockoutLevel = $this->getLockoutLevel($email);
                $lockoutTime = $lockoutLevel === 0 ? self::FIRST_LOCKOUT_TIME : self::SECOND_LOCKOUT_TIME;
                $minutes = ceil($lockoutTime / 60);
                
                throw new LoginException(
                    "Too many failed login attempts. Please try again in {$minutes} minute" . ($minutes !== 1 ? 's' : ''),
                    'account_locked',
                    [
                        'minutesRemaining' => $minutes,
                        'secondsRemaining' => 0,
                    ]
                );
            }
            
            // Wrong credentials but still has attempts remaining
            throw new LoginException(
                "Wrong credentials. Please try again.",
                'wrong_credentials',
                [
                    'attemptsRemaining' => $remainingAttempts,
                ]
            );
        }

        // Clear failed attempts on successful login
        $this->clearFailedAttempts($email);
        // Also clear the lockout level on successful login
        Cache::forget($this->getLockoutLevelKey($email));

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
