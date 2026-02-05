<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!$request->user() || $request->user()->role->name !== $role) {
            return response()->json(['error' => 'Not authorized to access this resource'], 403);
        }

        return $next($request);
    }
}
