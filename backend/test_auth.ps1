$baseUrl = 'http://localhost:8081/api';
$body = @{ email = 'admin@supermart.com'; password = 'Admin@123' } | ConvertTo-Json;
$login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType 'application/json';
$token = $login.token;
$headers = @{ Authorization = "Bearer $token" };
try {
   $res = Invoke-WebRequest -Uri "$baseUrl/societies" -Headers $headers
   Write-Output $res.StatusCode
} catch {
   Write-Output $_.Exception.Response.StatusCode;
}
