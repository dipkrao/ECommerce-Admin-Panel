# Ecommerce Admin Panel

A modern, responsive React admin panel for managing ecommerce stores with a beautiful UI built with Tailwind CSS.

## Features

- **Modern UI**: Built with Tailwind CSS and Lucide React icons
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation
- **Dashboard**: Product statistics and overview with recent products table
- **Product Management**: Full CRUD operations with search, filters, and pagination
- **Authentication**: Secure login/logout system with protected routes
- **Real-time Updates**: Live data fetching and state management
- **Form Validation**: React Hook Form with comprehensive validation
- **Toast Notifications**: User-friendly feedback system
- **Legal Content Management**: Dynamic privacy policy, terms of service, and cookie policy management

## Project Structure

```
ECommerce-Admin-Panel/
├── public/              # Static assets
│   └── index.html      # Main HTML file
├── src/
│   ├── components/     # Reusable components
│   │   ├── Layout.js   # Main layout wrapper
│   │   ├── Sidebar.js  # Navigation sidebar
│   │   └── Header.js   # Top header with user menu
│   ├── contexts/       # React contexts
│   │   └── AuthContext.js # Authentication context
│   ├── pages/          # Page components
│   │   ├── Login.js    # Login page
│   │   ├── Dashboard.js # Dashboard overview
│   │   └── Products.js # Products management
│   ├── App.js          # Main app component
│   ├── index.js        # App entry point
│   └── index.css       # Global styles with Tailwind
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see ECommerce-Backend project)

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API endpoint

The admin panel is configured to proxy requests to `http://localhost:5000` (the backend API).

If your backend is running on a different port or URL, update the `proxy` field in `package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

### 3. Start the development server

```bash
npm start
```

The admin panel will be available at `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
```

## Pages & Features

### Dashboard

- Product statistics overview
- Recent products table
- Quick action buttons for adding products

### Products Management

- Product listing with search and filters
- Add/Edit/Delete products
- Image upload support
- Stock management
- Status toggling (active/inactive)

### Legal Content Management

- **Privacy Policy**: Dynamic content management with rich text editor
- **Terms of Service**: Easy-to-update terms and conditions
- **Cookie Policy**: Manage cookie policy information
- **About Us**: Manage company information and story
- **Rich Text Editor**: Full formatting options with HTML support
- **Content Preview**: See changes before publishing
- **Version Tracking**: Track last updated timestamps

### Authentication

- Secure login form
- Protected routes
- User profile management
- Logout functionality

## Component Architecture

### Layout Component

- Wraps all authenticated pages
- Manages sidebar state
- Handles responsive navigation

### Sidebar Component

- Navigation menu with icons
- Mobile-responsive design
- Active route highlighting

### Header Component

- User profile dropdown
- Mobile menu button
- Current page title

### AuthContext

- Manages authentication state
- Handles login/logout
- Provides user data to components

## Styling

The project uses **Tailwind CSS** for styling:

- Utility-first CSS framework
- Responsive design utilities
- Custom color scheme
- Component-based styling

### Custom Colors

```css
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8'
}
```

## API Integration

The admin panel communicates with the backend API through:

- **Axios** for HTTP requests
- **JWT tokens** for authentication
- **Proxy configuration** for development
- **Error handling** with toast notifications

## Responsive Design

- **Mobile-first** approach
- **Collapsible sidebar** on mobile devices
- **Touch-friendly** interface
- **Responsive tables** and forms
- **Adaptive layouts** for all screen sizes

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.js`
3. Add navigation item in `src/components/Sidebar.js`

### Adding New Components

1. Create component in `src/components/`
2. Import and use in relevant pages
3. Follow existing component patterns

### Styling Guidelines

- Use Tailwind CSS utilities
- Follow mobile-first approach
- Maintain consistent spacing
- Use semantic color classes

## Building for Production

```bash
# Create production build
npm run build

# The build folder contains optimized files
# Deploy this folder to your web server
```

## Demo Credentials

**Admin Login:**

- Email: admin@example.com
- Password: admin123

_Note: These credentials are managed by the backend API._

## Dependencies

### Core

- React 18.2.0
- React Router DOM 6.3.0
- React Scripts 5.0.1

### UI & Styling

- Tailwind CSS 3.2.7
- Lucide React 0.263.1
- PostCSS & Autoprefixer

### Forms & Validation

- React Hook Form 7.43.5
- React Hot Toast 2.4.0

### HTTP Client

- Axios 1.3.4

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the ISC License.

## Support

For support and questions, please refer to the backend API documentation or open an issue in the repository.
