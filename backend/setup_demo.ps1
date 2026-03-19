$baseUrl = "http://localhost:8081/api"
$adminLoginBody = @{ email = "admin@supermart.com"; password = "Admin@123" } | ConvertTo-Json
$adminRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminRes.token
$adminId = $adminRes.id

$headers = @{ Authorization = "Bearer $adminToken" }

$societyBody = @{
    name = "Demo Society"
    address = "Demo Park"
    city = "Demo City"
    pincode = "000000"
    location = "Demo Location"
    threshold = 5
    discountPercentage = 10.0
} | ConvertTo-Json

$societyRes = Invoke-RestMethod -Uri "$baseUrl/societies/create?userId=$adminId" -Method Post -Body $societyBody -ContentType "application/json" -Headers $headers
$societyId = $societyRes.id
$inviteCode = $societyRes.inviteCode

$productBody = @{
    name = "Premium Demo Wheat 10kg"
    description = "Demo Product"
    price = 600.0
    stockQuantity = 500
    category = "GROCERY"
    imageUrl = "https://m.media-amazon.com/images/I/71N15oB2XcL._AC_UF1000,1000_QL80_.jpg"
    seller = "SuperMart"
} | ConvertTo-Json

$productRes = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Body $productBody -ContentType "application/json" -Headers $headers
$productId = $productRes.id

$tomorrow = (Get-Date).AddDays(5).ToString("yyyy-MM-ddTHH:mm:ss")
$bulkBody = @{
    productId = $productId
    societyId = $societyId
    targetQuantity = 10
    discountPercentage = 25.0
    expiryTime = $tomorrow
} | ConvertTo-Json

$bulkRes = Invoke-RestMethod -Uri "$baseUrl/bulk-orders/create" -Method Post -Body $bulkBody -ContentType "application/json" -Headers $headers

Write-Output "INVITE_CODE=$inviteCode"
