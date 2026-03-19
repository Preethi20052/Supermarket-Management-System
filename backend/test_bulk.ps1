$baseUrl = "http://localhost:8081/api"
$adminLoginBody = @{ email = "admin@supermart.com"; password = "Admin@123" } | ConvertTo-Json
$adminRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminRes.token
$adminId = $adminRes.id

Write-Output "Admin Login OK. Token: $adminToken / ID: $adminId"

$headers = @{ Authorization = "Bearer $adminToken" }

$societyBody = @{
    name = "Auto PS Society"
    address = "123 Tech Park"
    city = "Bangalore"
    pincode = "560001"
    location = "Bangalore"
    threshold = 10
    discountPercentage = 20.0
} | ConvertTo-Json

try {
    $societyRes = Invoke-RestMethod -Uri "$baseUrl/societies/create?userId=$adminId" -Method Post -Body $societyBody -ContentType "application/json" -Headers $headers
    $societyId = $societyRes.id
    $inviteCode = $societyRes.inviteCode
} catch {
    Write-Output "FAIL: SOCIETY CREATE"
    Write-Output $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $ErrorMsg = $reader.ReadToEnd()
        Write-Output "Body: $ErrorMsg"
    }
}

Write-Output "Society Created - ID: $societyId, Invite: $inviteCode"

$productBody = @{
    name = "PS Rice 5kg"
    description = "Test Product"
    price = 500.0
    stockQuantity = 100
    category = "GROCERY"
    imageUrl = "https://via.placeholder.com/150"
    seller = "SuperMart"
} | ConvertTo-Json

$productRes = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $productBody -ContentType "application/json" -Headers $headers
$productId = $productRes.id

Write-Output "Product Created - ID: $productId"

$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
$bulkBody = @{
    productId = $productId
    societyId = $societyId
    targetQuantity = 10
    discountPercentage = 15.0
    expiryTime = $tomorrow
} | ConvertTo-Json

$bulkRes = Invoke-RestMethod -Uri "$baseUrl/bulk-orders/create" -Method Post -Body $bulkBody -ContentType "application/json" -Headers $headers
$bulkOrderId = $bulkRes.id

Write-Output "Bulk Order Created - ID: $bulkOrderId"

$custBody = @{
    name = "PS Customer"
    email = "ps.customer@example.com"
    password = "password123"
    phone = "9998887776"
    address = "Apt 101"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $custBody -ContentType "application/json"
} catch {}

$custLoginBody = @{ email = "ps.customer@example.com"; password = "password123" } | ConvertTo-Json
$custRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $custLoginBody -ContentType "application/json"
$custToken = $custRes.token
$custId = $custRes.id

Write-Output "Customer Login OK"

$custHeaders = @{ Authorization = "Bearer $custToken" }

try {
    Invoke-RestMethod -Uri "$baseUrl/societies/join?userId=$custId&inviteCode=$inviteCode" -Method Post -Headers $custHeaders
    Write-Output "Customer Joined Society"
} catch {
    Write-Output "Customer might already be in a society"
}

$joinBulkBody = @{
    bulkOrderId = $bulkOrderId
    quantity = 10
} | ConvertTo-Json

$joinRes = Invoke-RestMethod -Uri "$baseUrl/bulk-orders/join" -Method Post -Body $joinBulkBody -ContentType "application/json" -Headers $custHeaders

Write-Output "Bulk Order Joined! Current Quantity: $($joinRes.currentQuantity), Target: $($joinRes.targetQuantity)"
Write-Output "Status: $($joinRes.status)"
