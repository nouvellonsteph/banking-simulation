# Banking API Demo

A Next.js application that demonstrates banking API capabilities, deployed on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fnouvellonsteph%2Fbanking-simulation)


## Overview

This project showcases modern banking APIs through a demo application that provides:

- User authentication
- Account management
- Transaction history
- Payment methods
- Contact functionality
- Interactive API documentation

## Architecture

- **Frontend**: Next.js App Router with React
- **Backend**: API routes implemented as Next.js route handlers
- **Deployment**: Cloudflare Workers (via Open Next)
- **Documentation**: OpenAPI/Swagger integration

## Features

### Authentication
The application includes a secure login system with proper authentication utilities. Cloudflare tunstile is also demonstrated when the query string `?turnstile=true` is added to the URL.

### Banking Features
- **Accounts**: View available accounts and details
- **Transactions**: Access transaction history 
- **Payment Methods**: Manage payment options
- **User Profile**: View and manage user information

### Contact

The application includes a contact form for user inquiries. Cloudflare turnstile is also demonstrated when the query string `?turnstile=true` is added to the URL.

### API Documentation
Interactive API documentation is available through:
- Swagger UI integration
- OpenAPI specification

## API Endpoints

The application exposes the following API endpoints:

- `/api/login` - Authentication endpoint
- `/api/accounts` - Account management
- `/api/transactions` - Transaction history
- `/api/user-profile` - User profile information
- `/api/payment-methods` - Payment methods
- `/api/contact` - Contact functionality
- `/api/swagger` - Swagger UI for API documentation
- `/api/openapi` - OpenAPI specification
- `/api/api-docs` - Additional API documentation


ℹ️ **Info:** The endpoint /api/user-profile is answering to requests without an api-key, which is useful when demonstration our API shield capabilities around surfacing mixed auth events



## Pages

- `/` - Home page
- `/login` - User login
- `/contact` - Contact form
- `/api-demo` - Interactive API demonstration
- `/api-docs` - API documentation

## Getting Started

### Prerequisites

- Node.js (version 18 or later recommended)
- npm, yarn, pnpm, or bun

### Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

### Deployment to Cloudflare Workers

This project is configured for deployment to Cloudflare Workers using [Open Next](https://github.com/cloudflare/next-on-pages).

1. Configure your `wrangler.jsonc` with appropriate settings (see [Customization](#customization) below)
2. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   # or
   bun build
   ```
3. Deploy to Cloudflare Workers:
   ```bash
   npx wrangler deploy
   ```

## Customization

The application can be easily customized through settings in the `wrangler.jsonc` file. These settings allow you to adapt the banking website to your specific needs without changing the codebase.

### Environment Variables

The following environment variables can be configured in the `vars` section of `wrangler.jsonc`:

```jsonc
"vars": { 
  "API_BASE_URL": "https://your-api-endpoint.com",
  "COMPANY_NAME": "Your Bank Name",
  "COLOR_PRIMARY": "#YourBrandColor",
  "TURNSTILE_SITE_KEY": "YourTurnstileSiteKey",
  "TURNSTILE_SECRET_KEY": "YourTurnstileSecretKey"

},
```

- **API_BASE_URL**: The base URL for your banking API. This should point to your backend API service that provides the banking data.
- **COMPANY_NAME**: The name of your banking organization. This will be displayed throughout the application UI.
- **COLOR_PRIMARY**: The primary brand color in hexadecimal format. This will be used for styling elements throughout the application.
- **TURNSTILE_SITE_KEY**: Your Cloudflare Turnstile site key for CAPTCHA functionality.
- **TURNSTILE_SECRET_KEY**: Your Cloudflare Turnstile secret key for CAPTCHA functionality.

### Cron Trigger Functionality

The banking website includes a scheduled worker that runs via the cron trigger configured in `wrangler.jsonc`. This worker performs the following functions:

- Executes automated API testing to ensure all endpoints are functioning correctly
- Generates randomized API traffic with varying request types (GET, POST, PUT, PATCH, DELETE)
- Tests different endpoints with various API tokens to simulate different user access levels
- Creates a detailed test summary showing request distribution and success rates
- Can be used for performance monitoring and detecting API issues in production

The cron trigger frequency can be adjusted in the `wrangler.jsonc` file. By default, it's set to run every minute (`"* * * * *"`), but you can modify this to run less frequently in production environment

### Caveat
```
The cron job will effectively send requests to the API endpoints, but these won't be seen in the API shield product and some of analytics pages since the the request source field `requestSource` is set to `EdgeWorkerFetch`. This is in general useful done to avoid counting twice the request triggering a worker from a client. In that case this is purely generated via Cron and not from a client. 
```

## API Documentation

The API documentation is available at:
- Swagger UI: `/api/swagger` endpoint
- OpenAPI Specification: `/api/openapi` endpoint
- API Documentation Page: `/api-docs` route

## Contributing

Please follow the project's coding standards and submit pull requests for any proposed changes.
