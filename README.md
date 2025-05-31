# The URL List Application

A modern, secure URL management application built with Astro, TypeScript, and PostgreSQL. Create, manage, and share collections of URLs with built-in authentication and security features.

## ✨ Features

- **Authentication**
  - Email/Password authentication with email verification
  - GitHub OAuth integration
  - Secure password reset functionality
  - JWT-based session management

- **URL Management**
  - Create and organize URL collections
  - Share lists with others
  - Track URL metadata
  - Custom list organization

- **Security**
  - HTTP-only cookies
  - Automatic JWT rotation
  - Input sanitization
  - SQL injection prevention
  - XSS protection

## 🛠️ Tech Stack

- **Frontend**: Astro, TailwindCSS
- **Backend**: Node.js, PostgreSQL
- **Authentication**: JWT, bcrypt, GitHub OAuth
- **Email**: Nodemailer
- **Type Safety**: TypeScript, Zod
- **ORM**: Prisma

## 📦 Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- npm or yarn
- SMTP server access (for email functionality)

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd beneficial-binary
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with the following variables:
   ```bash
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

   # SMTP Configuration
   SMTP_HOST="smtp.example.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@example.com"
   SMTP_PASS="your-smtp-password"
   SMTP_FROM="Your App <noreply@example.com>"

   # Application
   PUBLIC_URL="http://localhost:3000"
   JWT_SECRET="your-secure-jwt-secret"

   # GitHub OAuth (Optional)
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # Notifications (Optional)
   SLACK_WEBHOOK_URL=""
   DISCORD_WEBHOOK_URL=""
   ```

4. **Database Setup**
   ```bash
   npx prisma migrate deploy
   ```

5. **Start the Application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:4321`

## 🧞 Available Commands

| Command                   | Action                                           |
|:-------------------------|:------------------------------------------------|
| `npm install`            | Install dependencies                             |
| `npm run dev`            | Start development server at `localhost:4321`     |
| `npm run build`          | Build production application                     |
| `npm run preview`        | Preview production build locally                 |
| `npm run rotate-jwt`     | Rotate JWT secret key                           |
| `npx prisma studio`      | Open Prisma database management UI              |
| `npx prisma migrate dev` | Run database migrations                         |

## 🔐 Security Features

### Authentication Methods

1. **Email/Password**
   - Strong password requirements
   - Secure password hashing using bcrypt
   - Email verification required

2. **GitHub OAuth**
   - Secure OAuth flow
   - Email verification through GitHub
   - Automatic account linking

3. **Password Reset**
   - Secure token-based reset process
   - Time-limited reset tokens
   - Email verification required

### Security Measures

- **JWT Authentication**
  - HTTP-only cookies
  - 7-day token expiration
  - Automatic secret rotation

- **Data Protection**
  - Input sanitization
  - SQL injection prevention via Prisma
  - XSS protection with Astro's built-in safety
  - CSRF protection
  - Secure headers

## 🔄 Maintenance

### JWT Secret Rotation

To rotate the JWT secret:

```bash
npm run rotate-jwt
```

This will:
1. Generate a new secret
2. Backup the old secret
3. Update the environment configuration
4. Log the rotation

### Database Backups

Regularly backup your PostgreSQL database:

```bash
pg_dump -U your-user -d your-database > backup.sql
```

## 📝 Development

### Project Structure

```
beneficial-binary/
├── src/
│   ├── components/    # Reusable UI components
│   ├── layouts/       # Page layouts
│   ├── lib/          # Core functionality
│   ├── pages/        # Route definitions
│   ├── styles/       # Global styles
│   └── utils/        # Helper functions
├── prisma/
│   └── schema.prisma # Database schema
├── scripts/          # Utility scripts
├── public/          # Static assets
└── tests/           # Test suites
```

### Adding New Features

1. Create new components in `src/components`
2. Add routes in `src/pages`
3. Update database schema in `prisma/schema.prisma`
4. Run migrations with `npx prisma migrate dev`

## 📄 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🐛 Bug Reports

Report bugs through the issue tracker with:
- Expected behavior
- Actual behavior
- Steps to reproduce
- Screenshots (if applicable)

## 📧 Contact

For questions and support, please create an issue in the repository or contact the maintainers.

## Test User
Email: test@example.com Password: testpass123
