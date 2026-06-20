# Student Living & Well-being Support System

A modern, premium front-end application for students to find accommodation, discover food services, and navigate transportation options on campus.

## Features

### 🏠 Accommodation Finder
- Search and filter properties by type, price, and bedrooms
- View detailed property information with amenities
- Interactive property cards with images and key details
- Comprehensive accommodation listings

### 🍔 Food & Dining Services
- Discover restaurants and dining halls near campus
- Filter by cuisine type, dietary preferences, and price range
- View full menus with categories and pricing
- Check operating hours and location information

### 🚌 Transportation Navigator
- Browse campus shuttle and bus routes
- View detailed schedules with timeline visualization
- Interactive campus map with key stops
- Search routes by destination

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Styling and design system
- **React Router** - Navigation
- **Lucide React** - Icon library

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design Features

- **Glassmorphism effects** for a modern, premium look
- **Smooth animations** and transitions throughout
- **Responsive design** that works on all devices
- **Custom color gradients** and theming
- **Interactive components** with hover effects
- **Modal views** for detailed information

## Project Structure

```
src/
├── components/
│   ├── accommodation/     # Accommodation finder components
│   ├── food/             # Food services components
│   ├── transportation/   # Transportation components
│   └── layout/           # Navbar, Footer, Layout
├── data/
│   └── mockData.js       # Sample data for demonstration
├── pages/
│   └── StudentLiving.jsx # Main page with tab navigation
├── utils/
│   └── helpers.js        # Utility functions
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Features Breakdown

### Tab Navigation
Switch seamlessly between three main sections:
- Accommodation
- Food & Dining
- Transportation

### Search & Filters
Each section includes robust search and filtering:
- Real-time search results
- Multiple filter criteria
- Clear and reset options

### Detailed Views
Click on any item to see comprehensive details:
- Accommodation: Full specs, amenities, contact info
- Restaurants: Complete menus, hours, dietary options
- Routes: Full schedules with stop-by-stop timelines

## Future Enhancements

- Integration with backend API
- Real-time transportation tracking
- User authentication and favorites
- Booking and reservation system
- Reviews and ratings system
- Google Maps integration

## License

MIT License - Feel free to use this project for your own university system!
