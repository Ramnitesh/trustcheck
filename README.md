# 🛡️ TrustCheck - WhatsApp Business Trust Platform

A complete MVP web application for verifying WhatsApp businesses, checking trust scores, reading reviews, and reporting scams.

## 🚀 Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with HTTP-only cookies
- **Deployment**: Vercel-ready

## ✨ Features

### 1. Public Search Page (`/`)
- Search WhatsApp numbers (10-digit validation)
- Beautiful landing page with features showcase
- Call-to-action for business registration

### 2. Business Public Profile (`/b/[number]`)
- Business information display
- Trust score with visual badges
- Verification status
- Profile view counter (auto-increments)
- Reviews list with ratings
- Add review functionality (public)
- Reports list (latest 3 shown)
- Report scam form

### 3. Authentication System
- **Register** (`/auth/register`): Create business account
- **Login** (`/auth/login`): Secure login with JWT
- Password hashing with bcryptjs
- HTTP-only cookie authentication

### 4. Business Dashboard (`/dashboard`)
- Create business profile
- Update business information
- View statistics:
  - Trust score
  - Profile views
  - Total reviews
  - Total reports
- Copy profile link
- View all reviews and reports

### 5. Admin Dashboard (`/admin`)
- List all businesses with search
- Verify/unverify businesses
- Ban/unban businesses
- View all reports
- Close reports
- Comprehensive business stats table

### 6. Trust Score Algorithm (0-100)
- Base score: 50
- Verified business: +30
- Average rating:
  - ≥4.5 stars: +20
  - ≥4.0 stars: +15
  - ≥3.0 stars: +5
  - <3.0 stars: -20
- Open reports: -10 each
- Banned business: 0 (forced)
- Auto-recalculates on review/report/verification changes

## 📁 Project Structure

```
trustcheck/
├── app/
│   ├── page.tsx                          # Home search page
│   ├── layout.tsx                        # Root layout
│   ├── globals.css                       # Global styles
│   ├── b/[number]/page.tsx              # Business profile
│   ├── auth/
│   │   ├── login/page.tsx               # Login page
│   │   └── register/page.tsx            # Register page
│   ├── dashboard/page.tsx               # Business dashboard
│   ├── admin/page.tsx                   # Admin dashboard
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── business/
│       │   ├── create/route.ts
│       │   ├── my/route.ts
│       │   ├── update/route.ts
│       │   └── [number]/route.ts
│       ├── reviews/
│       │   ├── add/route.ts
│       │   └── [businessId]/route.ts
│       ├── reports/
│       │   ├── add/route.ts
│       │   └── [businessId]/route.ts
│       └── admin/
│           ├── businesses/route.ts
│           ├── reports/route.ts
│           ├── business/
│           │   ├── verify/route.ts
│           │   └── ban/route.ts
│           └── report/close/route.ts
├── components/
│   ├── SearchBar.tsx                    # Search component
│   ├── TrustBadge.tsx                   # Trust score badge
│   ├── ReviewCard.tsx                   # Review display
│   ├── ReportForm.tsx                   # Report form
│   ├── Navbar.tsx                       # Navigation
│   └── Footer.tsx                       # Footer
├── lib/
│   ├── prisma.ts                        # Prisma client
│   ├── auth.ts                          # JWT utilities
│   └── trustScore.ts                    # Trust score calculator
├── prisma/
│   └── schema.prisma                    # Database schema
├── middleware.ts                         # Route protection
├── .env.example                         # Environment template
├── package.json
└── README.md
```

## 🗄️ Database Schema

### User
- id (UUID, Primary Key)
- name
- email (Unique)
- passwordHash
- role (default: "business")
- createdAt

### Business
- id (UUID, Primary Key)
- userId (Foreign Key → User)
- businessName
- whatsappNumber (Unique, 10 digits)
- category
- city
- address
- isVerified (default: false)
- isBanned (default: false)
- trustScore (default: 50)
- profileViews (default: 0)
- createdAt

### Review
- id (UUID, Primary Key)
- businessId (Foreign Key → Business)
- reviewerName
- rating (1-5)
- comment
- createdAt

### Report
- id (UUID, Primary Key)
- businessId (Foreign Key → Business)
- reason
- description
- status (default: "open")
- createdAt

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd trustcheck
npm install
```

### 2. Set Up Neon PostgreSQL Database

1. Go to [Neon](https://neon.tech) and create a new project
2. Copy your connection string
3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your Neon database URL:

```env
DATABASE_URL="postgresql://username:password@host.neon.tech:5432/database?sslmode=require"
JWT_SECRET="your_very_secure_random_secret_key_here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Create Admin User (Optional)

You can manually create an admin user using Prisma Studio or run this SQL in Neon:

```sql
-- First register a normal user through the app, then update their role
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - TrustCheck MVP"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` (your Neon connection string)
   - `JWT_SECRET` (secure random string)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)

5. Click "Deploy"

### 3. Run Database Migration on Vercel

After deployment, run:

```bash
npx prisma db push
```

Or set up automatic migrations in your `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build",
    "postinstall": "prisma generate"
  }
}
```

## 📝 Usage Guide

### For Public Users

1. **Search Business**: Enter 10-digit WhatsApp number on homepage
2. **View Profile**: See trust score, reviews, and verification status
3. **Add Review**: Rate and comment on your experience
4. **Report Scam**: Submit a report if business is fraudulent

### For Business Owners

1. **Register**: Create account at `/auth/register`
2. **Login**: Access dashboard at `/auth/login`
3. **Create Profile**: Add your WhatsApp business details
4. **Monitor**: View trust score, reviews, and reports
5. **Update**: Keep business information current
6. **Share**: Copy and share your profile link

### For Admins

1. **Access**: Login with admin account, go to `/admin`
2. **Verify**: Toggle verification status for businesses
3. **Moderate**: Ban fraudulent businesses
4. **Manage Reports**: Review and close reports
5. **Search**: Find businesses by name, number, or city

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **HTTP-only Cookies**: XSS protection
- **Route Protection**: Middleware guards dashboard/admin routes
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 🎨 Design Features

- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Clean, professional interface with TailwindCSS
- **Visual Feedback**: Loading states, error messages, success alerts
- **Trust Badges**: Color-coded trust score indicators
- **Professional Tables**: Clean data display with proper spacing

## 🧪 Testing Guide

### Test Scenarios

1. **User Registration & Login**
   - Register new business account
   - Login with credentials
   - Logout and verify session cleared

2. **Business Profile Creation**
   - Create business with valid WhatsApp number
   - Test 10-digit validation
   - Verify duplicate number prevention

3. **Public Profile Access**
   - Search for business by WhatsApp number
   - Verify profile view counter increments
   - Test review submission
   - Test report submission

4. **Trust Score Calculation**
   - Add reviews with different ratings
   - Submit reports
   - Verify trust score updates correctly

5. **Admin Functions**
   - Search businesses
   - Toggle verification
   - Ban/unban businesses
   - Close reports

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Business
- `POST /api/business/create` - Create business profile
- `GET /api/business/my` - Get user's business
- `PATCH /api/business/update` - Update business
- `GET /api/business/[number]` - Get business by WhatsApp number

### Reviews
- `POST /api/reviews/add` - Add review
- `GET /api/reviews/[businessId]` - Get business reviews

### Reports
- `POST /api/reports/add` - Add report
- `GET /api/reports/[businessId]` - Get business reports

### Admin
- `GET /api/admin/businesses` - List all businesses
- `PATCH /api/admin/business/verify` - Verify business
- `PATCH /api/admin/business/ban` - Ban business
- `GET /api/admin/reports` - List all reports
- `PATCH /api/admin/report/close` - Close report

## 🤝 Contributing

This is an MVP project. For production use, consider adding:
- Email verification
- Password reset functionality
- Rate limiting
- Image uploads for businesses
- Advanced search filters
- Analytics dashboard
- API rate limiting
- Automated testing suite

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🐛 Known Limitations

- No email notifications yet
- No image upload for business profiles
- No pagination for large datasets
- No real-time updates (requires page refresh)
- Basic search (no fuzzy matching)

## 💡 Future Enhancements

- [ ] Email notifications for reviews/reports
- [ ] Image upload for business logos
- [ ] Advanced analytics
- [ ] Export data to CSV
- [ ] API rate limiting
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Social media sharing
- [ ] Automated scam detection AI

---

**Built with ❤️ using Next.js 14, TypeScript, Prisma, and Neon PostgreSQL**

For support or questions, please open an issue on GitHub.
