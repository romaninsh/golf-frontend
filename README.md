# Club House Tags Admin

A React-based admin panel for managing golf club house tags and facilities. This application provides a secure, user-friendly interface for administrators to manage tags, users, and system configurations.

## Features

- 🔐 **Secure Authentication** - Auth0 integration with role-based access control
- 🏷️ **Tags Management** - Create, edit, and organize facility tags
- 📊 **Dashboard** - Overview of system status and quick actions
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, Vite
- **Authentication**: Auth0
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Form Handling**: React Hook Form

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account and application setup

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd golf-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with the following variables:
```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience

# Backend API Configuration
VITE_API_URL=your-backend-api-url

# Theme Configuration
VITE_THEME_SLUG=default
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
golf-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── useAuth.js    # Authentication hook
│   │   └── use-toast.js  # Toast notifications
│   ├── lib/
│   │   └── utils.js      # Utility functions
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── TagsPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── components.json       # shadcn/ui configuration
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Authentication

This application uses Auth0 for authentication. Users must sign in to access the admin panel. The authentication flow includes:

1. Redirect to Auth0 login page
2. User authenticates with Auth0
3. Redirect back to application with authorization code
4. Exchange code for access token
5. Use token for API requests

### Auth0 Configuration

Make sure your Auth0 application is configured with:
- **Application Type**: Single Page Application
- **Allowed Callback URLs**: `http://localhost:5173`, `https://yourdomain.com`
- **Allowed Logout URLs**: `http://localhost:5173`, `https://yourdomain.com`
- **Allowed Web Origins**: `http://localhost:5173`, `https://yourdomain.com`

## API Integration

The application is configured to work with a backend API running at the URL specified in `VITE_API_URL`. Currently, the following endpoints are expected:

- `GET /api/tags` - Fetch all tags
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/:id` - Update a tag
- `DELETE /api/tags/:id` - Delete a tag

## Styling

The application uses Tailwind CSS for styling with custom CSS variables defined in `src/index.css`. The design system includes:

- **Colors**: Primary, secondary, accent, and semantic colors
- **Typography**: Consistent font sizing and spacing
- **Components**: Reusable UI components from shadcn/ui
- **Responsive Design**: Mobile-first approach

## Components

### UI Components (shadcn/ui)

- **Button**: Various button styles and sizes
- **Card**: Content containers with headers and footers
- **Toast**: Notification system for user feedback
- **Form**: Form components with validation

### Custom Components

- **LoadingSpinner**: Loading state indicator
- **Pages**: Application pages (Login, Dashboard, Tags)

## State Management

The application uses React's built-in state management with:

- **useState**: Local component state
- **useEffect**: Side effects and lifecycle management
- **Custom Hooks**: Reusable logic (useAuth, useToast)

## Security

- **Authentication**: Required for all protected routes
- **Authorization**: Role-based access control
- **Token Management**: Secure token storage and refresh
- **HTTPS**: Enforced in production

## Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Traditional Hosting
```bash
npm run build
# Upload dist/ folder to your web server
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AUTH0_DOMAIN` | Your Auth0 domain | Yes |
| `VITE_AUTH0_CLIENT_ID` | Your Auth0 client ID | Yes |
| `VITE_AUTH0_AUDIENCE` | Your Auth0 API audience | Yes |
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_THEME_SLUG` | Theme identifier | No |

## Troubleshooting

### Common Issues

1. **Auth0 Login Fails**
   - Check Auth0 configuration
   - Verify environment variables
   - Ensure callback URLs are correct

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors if using TS

3. **Styling Issues**
   - Verify Tailwind CSS is properly configured
   - Check for conflicting CSS classes

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
