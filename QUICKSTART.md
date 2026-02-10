# 🚀 TrustCheck - Quick Start Guide

Get TrustCheck running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL account (free)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:pass@host.neon.tech:5432/db?sslmode=require"
JWT_SECRET="your_secure_random_secret_here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

1. **Register Account**: Go to `/auth/register`
2. **Create Business**: Fill in your business details
3. **Test Search**: Search for your WhatsApp number
4. **Add Review**: Test the review system
5. **Submit Report**: Test the reporting feature

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

## 👨‍💼 Create Admin User

After registering a regular user:

```bash
npx prisma studio
```

1. Open `users` table
2. Find your user
3. Change `role` from `"business"` to `"admin"`
4. Save and refresh your app
5. Access admin dashboard at `/admin`

## 📱 Test Data

Use these for testing:

**Test WhatsApp Numbers:**
- 9876543210
- 9123456789
- 8765432109

**Categories:**
- E-commerce
- Food & Beverage
- Services
- Education
- Healthcare

## 🐛 Troubleshooting

**Port 3000 in use:**
```bash
npm run dev -- -p 3001
```

**Database connection error:**
- Verify DATABASE_URL in .env
- Ensure Neon project is active
- Check firewall settings

**Prisma errors:**
```bash
rm -rf node_modules
npm install
npx prisma generate
```

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Visit admin dashboard to manage businesses
- Share your business profile links

## 🎉 You're Ready!

Your TrustCheck platform is now running. Start verifying WhatsApp businesses!

---

For issues, check the full README.md or open a GitHub issue.
