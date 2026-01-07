# 🚀 QUICK START GUIDE

## AADYAM LOGISTICS - Logistics Platform MVP

### ⚡ Quick Start (3 Steps)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   - Navigate to: `http://localhost:3000`
   - The app will automatically open in your default browser

### 📱 Available Pages

Once the server is running, you can access:

- **Home**: `http://localhost:3000/`
- **Track Shipment**: `http://localhost:3000/track`
- **Employee Dashboard**: `http://localhost:3000/employee-dashboard`
- **Manager Dashboard**: `http://localhost:3000/manager-dashboard`

### 🧪 Testing Shipment Tracking

Use these sample AWB numbers to test the tracking feature:

| AWB Number | Destination | Status |
|------------|-------------|--------|
| 6002770480 | Canada | Delivered |
| 99193184 | UK | Delivered |
| 885670900649 | Australia | Delivered |
| 6002771785 | USA | In Transit |
| 6002771861 | USA | Out for Delivery |

### 🎯 Key Features to Explore

#### Home Page
- Modern hero section with gradient backgrounds
- Statistics showcase
- Feature highlights
- Call-to-action buttons

#### Track Shipment
- Search by AWB number
- Animated timeline showing shipment progress
- Interactive world map with route visualization
- Real-time status updates (mock data)

#### Employee Dashboard
- KPI cards showing key metrics
- Filterable shipment table
- Status-based filtering
- Quick action buttons
- Responsive design

#### Manager Dashboard
- Performance analytics
- Interactive charts (Line, Pie, Bar)
- Employee performance comparison
- Regional performance metrics
- Key insights and recommendations

### 🎨 Design Highlights

- **Gradient Backgrounds**: Purple to blue gradients throughout
- **Glassmorphism**: Modern glass effect on cards
- **Smooth Animations**: Framer Motion for all transitions
- **Interactive Maps**: Leaflet with animated routes
- **Responsive Tables**: Sortable and filterable
- **Status Badges**: Color-coded shipment statuses

### 🛠️ Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (⚠️ irreversible)
npm run eject
```

### 📊 Mock Data Overview

The application includes:
- **5 shipments** with complete tracking data
- **5 employees** with performance metrics
- **6 months** of performance data
- **4 regions** with statistics
- **KPI metrics** for dashboards

### 🔧 Customization Guide

#### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#YOUR_COLOR',
    // ...
  }
}
```

#### Add New Shipments
Edit `src/data/mockData.js`:
```javascript
export const shipments = [
  // Add your shipment data here
];
```

#### Modify Components
All components are in `src/components/` and are fully customizable.

### 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### ⚠️ Important Notes

1. **This is a UI-only MVP** - No backend integration
2. **Mock data** is used throughout
3. **No authentication** required
4. **All features are demo** versions
5. **Ready for backend integration**

### 🔮 Next Steps for Production

To make this production-ready:

1. **Backend Integration**
   - Connect to REST API or GraphQL
   - Replace mock data with real API calls
   - Add error handling

2. **Authentication**
   - Implement user login
   - Add role-based access control
   - Secure routes

3. **Real-time Updates**
   - WebSocket integration
   - Live tracking updates
   - Push notifications

4. **Advanced Features**
   - PDF report generation
   - Email notifications
   - Advanced search and filters
   - Data export functionality

### 📞 Support

For issues or questions:
- Check the main README.md
- Review component documentation
- Inspect browser console for errors

### 🎉 Enjoy!

The platform is ready to use. Explore all features and customize as needed!

---

**AADYAM LOGISTICS PRIVATE LIMITED**
*Your Trusted Logistics Partner*
