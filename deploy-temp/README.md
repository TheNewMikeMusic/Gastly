# Maclock

A beautifully crafted Apple-style single-product store for the Retro Macintosh-style Digital Clock — built with Next.js, Tailwind, Framer Motion, and Stripe Checkout.

## Features

- 🎨 **Mobile-first Design** - Optimized for 375-430px viewports with progressive enhancement
- 🖼️ **Image Optimization** - Automatic image loading with prefix matching and fallbacks
- 💳 **Stripe Integration** - Full checkout flow with multi-currency and tax support
- 🔐 **Authentication** - Clerk integration for user management
- 💬 **Messaging System** - In-site messaging between buyers and staff
- 📊 **Dashboard** - Order management and message inbox
- ♿ **Accessibility** - WCAG compliant with keyboard navigation and screen reader support
- ⚡ **Performance** - Optimized for 60fps animations and fast loading

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account (for authentication)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Maclock
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
DATABASE_URL=postgresql://user:password@localhost:5432/maclock
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Maclock/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── success/           # Payment success page
│   ├── terms/             # Terms of service
│   ├── privacy/           # Privacy policy
│   ├── contact/           # Contact page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema
├── Public/                # Static assets (images)
└── public/                # Next.js public directory
```

## Image Assets

All product images are stored in the `/Public` directory and loaded using prefix matching. Supported formats: `.webp`, `.png`, `.jpg`, `.jpeg`, `.avif`.

The system automatically tries different extensions if a file is not found and logs warnings for suspicious filename patterns.

## Key Features Implementation

### EPIC A - Product Page
- ✅ Hero section with parallax rainbow ground
- ✅ Features grid with glass morphism cards
- ✅ Narrative blocks with alternating layouts
- ✅ Image gallery with modal preview
- ✅ Specifications strip
- ✅ FAQ accordion
- ✅ Footer with legal links

### EPIC B - Payments
- ✅ Stripe Checkout integration
- ✅ Order tracking
- ✅ Success/cancel pages

### EPIC C - Authentication
- ✅ Clerk integration
- ✅ Protected routes
- ✅ Login page

### EPIC D - Messaging
- ✅ Thread/Message models
- ✅ API endpoints for messages
- ✅ Automatic thread creation on purchase

### EPIC E - Dashboard
- ✅ Order list with status filtering
- ✅ Message inbox
- ✅ Protected admin access

### EPIC F - Assets
- ✅ Prefix-based image loading
- ✅ Fallback handling
- ✅ Warning system for file issues

### EPIC G - Brand & Motion
- ✅ Apple-style design language
- ✅ Smooth 60fps animations
- ✅ Reduced motion support

### EPIC H - SEO
- ✅ Meta tags and Open Graph
- ✅ Semantic HTML
- ✅ Analytics ready

### EPIC I - Performance & A11y
- ✅ Mobile-first responsive design
- ✅ Image optimization
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Safe area insets

### EPIC J - Legal
- ✅ Terms of service
- ✅ Privacy policy
- ✅ Contact page

## Building for Production

```bash
npm run build
npm start
```

## License

This project is an independent product and is not affiliated with Apple Inc.
