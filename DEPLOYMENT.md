# 🚀 TrustCheck - Complete Deployment Guide

This guide walks you through deploying TrustCheck to production on Vercel with Neon PostgreSQL.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Neon account (free tier works)

## Step-by-Step Deployment

### Phase 1: Database Setup (Neon PostgreSQL)

1. **Create Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for free account

2. **Create New Project**
   - Click "Create Project"
   - Project name: `trustcheck`
   - Region: Choose closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - Copy the connection string from dashboard
   - It looks like: `postgresql://username:password@host.neon.tech:5432/neondb?sslmode=require`
   - Save this - you'll need it soon!

### Phase 2: Code Preparation

1. **Update Environment Variables**
   
   Create `.env` file locally (for testing):
   ```env
   DATABASE_URL="your_neon_connection_string_here"
   JWT_SECRET="generate_a_secure_random_string_here"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

2. **Generate JWT Secret**
   
   Run this in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output for your JWT_SECRET

3. **Test Locally**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```
   
   Open http://localhost:3000 and test:
   - Homepage loads
   - Register account
   - Create business
   - Search works

### Phase 3: Git Setup

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TrustCheck MVP"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Repository name: `trustcheck`
   - Make it public or private
   - Don't initialize with README (we have one)
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/trustcheck.git
   git branch -M main
   git push -u origin main
   ```

### Phase 4: Vercel Deployment

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-configured)
   - Output Directory: `.next` (auto-configured)

3. **Add Environment Variables**
   
   Click "Environment Variables" and add these three:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
   - Environment: Production, Preview, Development (select all)

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: Your generated secure secret
   - Environment: Production, Preview, Development (select all)

   **Variable 3:**
   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://your-project-name.vercel.app` (will update after first deploy)
   - Environment: Production (only)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

### Phase 5: Post-Deployment Setup

1. **Update Base URL**
   - After deployment, copy your Vercel URL (e.g., `trustcheck-xyz.vercel.app`)
   - Go to Vercel Project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL
   - Redeploy: Deployments → Three dots → Redeploy

2. **Verify Database Connection**
   - Visit your site
   - Try registering a user
   - If successful, database connection works!

3. **Create Admin User**
   
   Option A: Using Neon SQL Editor
   - Go to Neon Dashboard → SQL Editor
   - First, register a user through your site
   - Then run:
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

   Option B: Using Prisma Studio (Local)
   ```bash
   npx prisma studio
   ```
   - Open the `users` table
   - Find your user
   - Change `role` from `business` to `admin`

4. **Test All Features**
   - ✅ Homepage and search
   - ✅ User registration and login
   - ✅ Business profile creation
   - ✅ Add reviews
   - ✅ Submit reports
   - ✅ Admin dashboard (with admin account)

### Phase 6: Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Project Settings → Domains
   - Add your domain (e.g., `trustcheck.com`)
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_BASE_URL` to your custom domain
   - Redeploy

## 🔧 Troubleshooting

### Build Fails on Vercel

**Issue:** Prisma generate fails

**Solution:**
- Ensure `postinstall` script is in package.json
- Check DATABASE_URL is set in Vercel environment variables
- Redeploy

### Database Connection Error

**Issue:** Can't connect to Neon

**Solution:**
- Verify DATABASE_URL is correct
- Ensure it ends with `?sslmode=require`
- Check Neon project is active (not suspended)

### JWT Token Issues

**Issue:** Login not working

**Solution:**
- Verify JWT_SECRET is set
- Clear cookies and try again
- Check browser console for errors

### Middleware Redirect Loop

**Issue:** Infinite redirects

**Solution:**
- Check middleware.ts is configured correctly
- Ensure auth cookie is being set
- Verify JWT_SECRET matches between environments

### Trust Score Not Updating

**Issue:** Score doesn't change after reviews

**Solution:**
- Check browser console for API errors
- Verify calculateTrustScore function is being called
- Check database for correct review/report counts

## 📊 Monitoring & Maintenance

### Analytics

Set up Vercel Analytics:
1. Project Settings → Analytics
2. Enable Web Analytics
3. View real-time traffic and performance

### Database Monitoring

Monitor in Neon:
- Dashboard → Metrics
- Watch for:
  - Query performance
  - Storage usage
  - Connection count

### Regular Tasks

**Weekly:**
- Check error logs in Vercel
- Monitor database size
- Review user reports

**Monthly:**
- Update dependencies: `npm update`
- Check security alerts: `npm audit`
- Backup database (Neon has auto-backups)

## 🔐 Security Checklist

- ✅ Environment variables not committed to Git
- ✅ JWT_SECRET is strong random string
- ✅ Database connection uses SSL (`sslmode=require`)
- ✅ Password hashing enabled (bcryptjs)
- ✅ HTTP-only cookies for auth
- ✅ Middleware protects admin routes
- ✅ Input validation on all forms
- ✅ HTTPS enabled (automatic with Vercel)

## 🚀 Performance Optimization

### Enable Caching

Add to `next.config.js`:
```javascript
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}
```

### Database Connection Pooling

Neon handles this automatically with pooling enabled.

### Image Optimization

If adding images later:
```javascript
import Image from 'next/image'
```

## 📈 Scaling Considerations

### Free Tier Limits

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited deployments
- Good for MVP and testing

**Neon Free:**
- 0.5 GB storage
- ~5k monthly active hours
- Good for ~10k users

### When to Upgrade

Upgrade when you hit:
- 50k monthly visitors
- 1k+ businesses registered
- 10k+ reviews/reports
- Need better performance

## 🎉 You're Live!

Congratulations! Your TrustCheck platform is now live. Share your URL:

- With potential business users
- On social media
- In business communities
- To get feedback

## 📞 Support

If you encounter issues:
1. Check this deployment guide
2. Review README.md
3. Check Vercel deployment logs
4. Check Neon database logs
5. Open GitHub issue for bugs

---

**Deployment completed successfully! 🎊**

Your TrustCheck platform is now helping users verify WhatsApp businesses and avoid scams.
