<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;

class StorageController extends Controller
{
    public function serveFile($path)
    {
        try {
            // Decode URL-encoded path
            $path = urldecode($path);
            
            // Build full filesystem path
            $fullPath = storage_path('app/public/' . $path);
            
            // Security check: prevent path traversal
            $realPath = realpath($fullPath);
            $storageBasePath = realpath(storage_path('app/public'));
            
            if ($realPath === false || strpos($realPath, $storageBasePath) !== 0) {
                return response()->json(['error' => 'File not found'], 404);
            }
            
            // Check if file exists
            if (!file_exists($fullPath) || !is_file($fullPath)) {
                return response()->json(['error' => 'File not found'], 404);
            }
            
            // Determine MIME type
            $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'bmp' => 'image/bmp',
                'svg' => 'image/svg+xml',
            ];
            $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
            
            // Use Laravel's file download response for better performance
            return response()->file($fullPath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . basename($fullPath) . '"',
                'Cache-Control' => 'public, max-age=86400',
            ]);
            
        } catch (\Throwable $e) {
            Log::error('Exception in serveFile: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}
