<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckUserId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Get the authenticated user
            $user = Auth::user();
            // Check if the user's role_id is not 1 (assuming 1 is the admin role)
            if ($user->role_id !== 1) {
                abort(403, 'Unauthorized action.');
            }
        } else {
            // Handle unauthenticated requests gracefully
            abort(401, 'Unauthenticated.');
        }

        return $next($request);
    }
}
