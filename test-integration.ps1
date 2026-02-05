#!/usr/bin/env pwsh
# Integration Test Script for FoodHub
# This script tests the backend API endpoints to ensure they're working correctly

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  FoodHub Backend Integration Tests  " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000/api"
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = $null
    )
    
    try {
        Write-Host "Testing: $Name... " -NoNewline
        
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Headers) {
            $params.Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        Write-Host "✓ PASSED" -ForegroundColor Green
        $script:passed++
        return $response
    }
    catch {
        Write-Host "✗ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

# Test 1: Health Check
Write-Host "`n[1] Health Check" -ForegroundColor Yellow
Test-Endpoint -Name "API Health Check" -Url "$baseUrl/health"

# Test 2: Get Menu Items (Public)
Write-Host "`n[2] Public Endpoints" -ForegroundColor Yellow
$menuItems = Test-Endpoint -Name "Get Menu Items" -Url "$baseUrl/menu-items"

if ($menuItems) {
    Write-Host "  → Found $($menuItems.data.Count) menu items" -ForegroundColor Gray
}

# Test 3: Register New User
Write-Host "`n[3] User Registration" -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$registerData = @{
    name = "Test User $timestamp"
    email = "test$timestamp@example.com"
    password = "password123"
    role = "Customer"
}

$registerResponse = Test-Endpoint -Name "Register New User" -Url "$baseUrl/auth/register" -Method "POST" -Body $registerData

if ($registerResponse) {
    $token = $registerResponse.data.token
    Write-Host "  → User registered with token" -ForegroundColor Gray
    
    # Test 4: Get Current User (Authenticated)
    Write-Host "`n[4] Authenticated Endpoints" -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    Test-Endpoint -Name "Get Current User" -Url "$baseUrl/auth/me" -Headers $headers
    
    # Test 5: Create Order
    Write-Host "`n[5] Order Creation" -ForegroundColor Yellow
    
    if ($menuItems -and $menuItems.data.Count -gt 0) {
        $orderData = @{
            items = @(
                @{
                    menu_item_id = $menuItems.data[0].id
                    quantity = 2
                }
            )
        }
        
        $order = Test-Endpoint -Name "Create Order" -Url "$baseUrl/orders" -Method "POST" -Body $orderData -Headers $headers
        
        if ($order) {
            Write-Host "  → Order created with ID: $($order.data.id)" -ForegroundColor Gray
        }
    }
    
    # Test 6: Get User Orders
    Test-Endpoint -Name "Get My Orders" -Url "$baseUrl/orders/my-orders" -Headers $headers
    
    # Test 7: Logout
    Write-Host "`n[6] Logout" -ForegroundColor Yellow
    Test-Endpoint -Name "Logout User" -Url "$baseUrl/auth/logout" -Method "POST" -Headers $headers
}

# Test 8: Login
Write-Host "`n[7] User Login" -ForegroundColor Yellow
$loginData = @{
    email = "admin@foodhub.com"
    password = "password"
}

$loginResponse = Test-Endpoint -Name "Login User" -Url "$baseUrl/auth/login" -Method "POST" -Body $loginData

if ($loginResponse) {
    $adminToken = $loginResponse.data.token
    Write-Host "  → Logged in as: $($loginResponse.data.name)" -ForegroundColor Gray
    
    # Test 9: Admin Endpoints
    Write-Host "`n[8] Admin Endpoints" -ForegroundColor Yellow
    $adminHeaders = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    Test-Endpoint -Name "Get All Orders (Admin)" -Url "$baseUrl/orders" -Headers $adminHeaders
    
    # Create test menu item
    $menuItemData = @{
        name = "Test Item $timestamp"
        description = "Test description"
        price = 99.99
        image_url = ""
    }
    
    $newItem = Test-Endpoint -Name "Create Menu Item (Admin)" -Url "$baseUrl/menu-items" -Method "POST" -Body $menuItemData -Headers $adminHeaders
    
    if ($newItem) {
        $itemId = $newItem.data.id
        Write-Host "  → Menu item created with ID: $itemId" -ForegroundColor Gray
        
        # Update menu item
        $updateData = @{
            name = "Updated Test Item"
            description = "Updated description"
            price = 149.99
            image_url = ""
            availability_status = $true
        }
        
        Test-Endpoint -Name "Update Menu Item (Admin)" -Url "$baseUrl/menu-items/$itemId" -Method "PUT" -Body $updateData -Headers $adminHeaders
        
        # Delete menu item
        Test-Endpoint -Name "Delete Menu Item (Admin)" -Url "$baseUrl/menu-items/$itemId" -Method "DELETE" -Headers $adminHeaders
    }
}

# Summary
Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "           Test Summary               " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Total:  $($passed + $failed)" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All tests passed! Backend is ready." -ForegroundColor Green
} else {
    Write-Host "✗ Some tests failed. Check the output above." -ForegroundColor Red
}

Write-Host ""
