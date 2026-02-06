<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StorageController extends Controller
{
    public function serveFile($path)
    {
        $fullPath = 'public/' . $path;
        
        if (!Storage::exists($fullPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $file = Storage::get($fullPath);
        $mimeType = Storage::mimeType($fullPath);

        return response($file, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline',
        ]);
    }
}
