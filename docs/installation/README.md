# Installation Guide

This guide will walk you through the process of setting up the Atomic Habits Tracker application for development or personal use.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Git

## Clone the Repository

```bash
git clone https://github.com/yourusername/atomic-habits-tracker.git
cd atomic-habits-tracker
```

## Install Dependencies

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
SESSION_SECRET=your_session_secret
```

Generate a secure random string for the `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Development Mode

To start the application in development mode, run:

```bash
npm run dev
```

This will start both the frontend and backend servers. The application will be available at [http://localhost:3000](http://localhost:3000).

## Build for Production

To build the application for production, run:

```bash
npm run build
```

This will create optimized production builds of both the frontend and backend.

## Running in Production

To start the application in production mode after building, run:

```bash
npm start
```

## Project Structure

- `client/`: Frontend React application
  - `src/`: Source code
    - `components/`: Reusable UI components
    - `contexts/`: React context providers
    - `hooks/`: Custom React hooks
    - `layouts/`: Page layout components
    - `lib/`: Utility functions and constants
    - `pages/`: Application pages
- `server/`: Backend Express server
  - `storage.ts`: Data storage interface
  - `routes.ts`: API route definitions
  - `auth.ts`: Authentication handling
- `shared/`: Code shared between frontend and backend
  - `schema.ts`: Database schema and TypeScript types
- `docs/`: Documentation

## Database

By default, the application uses an in-memory database. This is suitable for development and personal use. For production use, you may want to set up a persistent database.

## Authentication

The application uses Express session authentication with Passport.js. Users can register with a username and password, and sessions are stored in the configured session store.

## Customization

### Theming

The application supports customizing the theme. The theme configuration is located in `theme.json` at the root of the project. You can modify this file to change the appearance of the application.

```json
{
  "primary": "#6366f1",
  "variant": "vibrant",
  "appearance": "system",
  "radius": 0.5
}
```

- `primary`: The primary color used throughout the application
- `variant`: The color variation style (`professional`, `tint`, or `vibrant`)
- `appearance`: The default theme mode (`light`, `dark`, or `system`)
- `radius`: The border radius size for UI elements

### Adding New Features

When adding new features, follow these guidelines:
1. Define types in `shared/schema.ts`
2. Implement storage methods in `server/storage.ts`
3. Add API routes in `server/routes.ts`
4. Create React components in the `client/src/components` directory
5. Add new pages in the `client/src/pages` directory
6. Register new routes in `client/src/App.tsx`

## Troubleshooting

### Common Issues

#### Application Fails to Start
- Check if all dependencies are installed
- Verify that no other service is using port 3000
- Check for errors in the console output

#### Authentication Issues
- Ensure the `SESSION_SECRET` is set in the `.env` file
- Clear browser cookies and try again
- Verify that the user exists in the database

#### Styling Issues
- Make sure Tailwind CSS is properly set up
- Check for conflicting styles
- Verify that the theme configuration is valid

## Getting Help

If you encounter any issues not covered in this guide, please:
1. Check the existing GitHub issues to see if the problem has been reported
2. Create a new issue with detailed information about the problem, including steps to reproduce, expected behavior, and actual behavior