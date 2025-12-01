# Gastly

A fully redesigned product site for the Gastly Humidifier 2.1, combining ghost-type aesthetics, purple-mist atmosphere, and a black-purple UI built for gamers, creators, and night-owls.

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
git clone https://github.com/TheNewMikeMusic/Gastly.git
cd Gastly
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
DATABASE_URL=postgresql://user:password@localhost:5432/gastly
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

## Building for Production

```bash
npm run build
npm start
```

## License

This project is an independent product.
