# Production Authentication System (SaaS Ready)

A modern, robust, and clean human-written authentication system built with **React 19**, **Vite**, **Tailwind CSS v4**, **Supabase Auth**, **React Hook Form**, and **Zod**.

---

## Features

- **Sign In**:
  - Email & password authentication with strict Zod validation.
  - Password visibility toggle (Eye / EyeOff).
  - Social OAuth support (Google, GitHub).
  - Inline error alerts for invalid credentials or unconfirmed accounts.
- **Sign Up**:
  - Full Name, Email, Password, and Password Confirmation fields.
  - Client-side validation ensuring passwords match.
  - Real-time password strength meter (Weak, Fair, Good, Strong).
  - Post-signup email verification instructions screen.
- **Password Recovery**:
  - Request password reset link by email.
  - Reset password page (`/reset-password`) for setting a new password via Supabase recovery tokens.
- **Protected Dashboard**:
  - Guarded by `<ProtectedRoute>` which checks user session.
  - Displays user profile (Initials, Full Name, Email, Verified status badge, Account ID, Last sign-in, Auth provider).
  - In-place display name updates via Supabase metadata.
  - Live session indicators and clean Sign Out action.
- **Route Guards**:
  - `ProtectedRoute`: Directs unauthenticated users to `/signin` while remembering previous location.
  - `PublicOnlyRoute`: Automatically redirects logged-in users visiting `/signin` or `/signup` to `/dashboard`.

---

## Architecture & File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── auth-alert.jsx       # Alert banner for feedback & errors
│   │   ├── button.jsx           # Shadcn UI button
│   │   ├── card.jsx             # Card layout container
│   │   ├── field.jsx            # Form field layout primitives
│   │   ├── input.jsx            # Themed input component
│   │   ├── label.jsx            # Label component
│   │   ├── separator.jsx        # Divider component
│   │   └── theme-provider.jsx   # Theme provider
│   ├── ProtectedRoute.jsx       # Auth guard for protected pages
│   └── PublicOnlyRoute.jsx      # Guard preventing authed users on login pages
├── context/
│   ├── authContext.js           # Context definition
│   ├── AuthProvider.jsx         # Supabase session provider & auth methods
│   └── useAuth.js               # Custom hook to consume AuthContext
├── lib/
│   ├── supabase.js              # Supabase client initialization & error handling
│   └── utils.js                 # Tailwind class merger utility
├── pages/
│   ├── Dashboard.jsx            # Protected user dashboard
│   ├── ForgotPassword.jsx       # Password recovery request page
│   ├── ResetPassword.jsx        # Password reset confirmation page
│   ├── Signin.jsx               # User sign-in page
│   └── Signup.jsx               # User registration page
├── App.jsx                      # Application router configuration
├── main.jsx                     # Application root entry point
└── index.css                    # Tailwind CSS v4 & theme design tokens
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- A [Supabase](https://supabase.com) project

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Set your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
```
