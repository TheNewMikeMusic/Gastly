# Stripe Configuration Helper
Write-Host ""
Write-Host "=== Stripe Configuration Helper ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Visit: https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
Write-Host "   Copy Secret key (sk_test_...)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Visit: https://dashboard.stripe.com/test/products" -ForegroundColor White
Write-Host "   Create product and copy Price ID (price_...)" -ForegroundColor Gray
Write-Host ""

$secretKey = Read-Host "Enter Stripe Secret Key"
$priceId = Read-Host "Enter Stripe Price ID"

if ($secretKey -and $priceId) {
    Write-Host ""
    Write-Host "Updating configuration..." -ForegroundColor Yellow
    
    $content = Get-Content .env.local -Raw
    $content = $content -replace 'STRIPE_SECRET_KEY=.*', "STRIPE_SECRET_KEY=$secretKey"
    $content = $content -replace 'NEXT_PUBLIC_STRIPE_PRICE_ID=.*', "NEXT_PUBLIC_STRIPE_PRICE_ID=$priceId"
    $content | Set-Content .env.local -Encoding UTF8
    
    Write-Host ""
    Write-Host "[SUCCESS] Configuration updated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuration:" -ForegroundColor Cyan
    Write-Host "  Secret Key: $secretKey" -ForegroundColor Gray
    Write-Host "  Price ID: $priceId" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Restart dev server: npm run dev" -ForegroundColor White
    Write-Host "  2. Visit: http://localhost:3000/checkout" -ForegroundColor White
    Write-Host "  3. Use test card: 4242 4242 4242 4242" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] Input is empty, configuration not updated" -ForegroundColor Red
    Write-Host "Please run the script again with correct values" -ForegroundColor Yellow
    Write-Host ""
}
