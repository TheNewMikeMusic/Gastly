# Stripe Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Stripe Payment Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check .env.local file
if (-not (Test-Path .env.local)) {
    Write-Host "[ERROR] .env.local file not found" -ForegroundColor Red
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item env.example .env.local
}

Write-Host "Please follow these steps to get your Stripe configuration:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Visit Stripe Dashboard: https://dashboard.stripe.com" -ForegroundColor White
Write-Host "2. Login to your account (sign up if needed)" -ForegroundColor White
Write-Host "3. Go to Developers -> API keys" -ForegroundColor White
Write-Host "4. Copy Test mode Secret key (sk_test_...)" -ForegroundColor White
Write-Host ""
Write-Host "5. Go to Products -> Add product" -ForegroundColor White
Write-Host "6. Create product and set price" -ForegroundColor White
Write-Host "7. Copy Price ID (price_...)" -ForegroundColor White
Write-Host ""

# Get user input
$secretKey = Read-Host "Enter Stripe Secret Key (sk_test_...)"
$priceId = Read-Host "Enter Stripe Price ID (price_...)"

# Validate input format
if ($secretKey -notmatch "^sk_test_") {
    Write-Host "[WARNING] Secret Key format may be incorrect (should start with sk_test_)" -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "Operation cancelled" -ForegroundColor Red
        exit
    }
}

if ($priceId -notmatch "^price_") {
    Write-Host "[WARNING] Price ID format may be incorrect (should start with price_)" -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "Operation cancelled" -ForegroundColor Red
        exit
    }
}

# Update .env.local file
Write-Host ""
Write-Host "Updating .env.local file..." -ForegroundColor Yellow

$envContent = Get-Content .env.local -Raw

# Update STRIPE_SECRET_KEY
if ($envContent -match "STRIPE_SECRET_KEY=.*") {
    $envContent = $envContent -replace "STRIPE_SECRET_KEY=.*", "STRIPE_SECRET_KEY=$secretKey"
} else {
    $envContent += "`nSTRIPE_SECRET_KEY=$secretKey"
}

# Update NEXT_PUBLIC_STRIPE_PRICE_ID
if ($envContent -match "NEXT_PUBLIC_STRIPE_PRICE_ID=.*") {
    $envContent = $envContent -replace "NEXT_PUBLIC_STRIPE_PRICE_ID=.*", "NEXT_PUBLIC_STRIPE_PRICE_ID=$priceId"
} else {
    $envContent += "`nNEXT_PUBLIC_STRIPE_PRICE_ID=$priceId"
}

$envContent | Set-Content .env.local -Encoding UTF8

Write-Host ""
Write-Host "[SUCCESS] Stripe configuration updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "   Secret Key: $secretKey" -ForegroundColor White
Write-Host "   Price ID: $priceId" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Restart dev server to load new config" -ForegroundColor White
Write-Host "   2. Visit http://localhost:3000/checkout to test payment" -ForegroundColor White
Write-Host "   3. Use test card: 4242 4242 4242 4242" -ForegroundColor White
Write-Host ""
