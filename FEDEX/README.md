# AADYAM LOGISTICS - Logistics Platform MVP

![AADYAM LOGISTICS](https://img.shields.io/badge/Status-MVP-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8)

## 🚀 Overview

**AADYAM LOGISTICS PRIVATE LIMITED** - A complete MVP frontend for a modern logistics platform built with React JS. This is a UI-only implementation featuring mock data, professional design, and scalable architecture.

## ✨ Features

### Public Pages
- **Home Page**: Modern landing page with hero section, features, stats, and CTA
- **Track Shipment**: Real-time shipment tracking with animated timeline and interactive map

### Dashboard Pages
- **Employee Dashboard**: Manage shipments, view KPIs, filter by status
- **Manager Dashboard**: Analytics, charts, team performance, regional insights

### Key Capabilities
- 📦 Real-time shipment tracking with AWB search
- 🗺️ Animated route visualization on world map
- 📊 Interactive charts and analytics
- 📈 Performance metrics and KPIs
- 🎨 Modern UI with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **React JS** (v18.2.0) - Functional components with hooks
- **React Router** (v6.20.0) - Client-side routing
- **Tailwind CSS** (v3.4.0) - Utility-first CSS framework
- **Framer Motion** (v10.16.16) - Animation library
- **Recharts** (v2.10.3) - Chart library for data visualization
- **Leaflet** (v1.9.4) - Interactive maps
- **React-Leaflet** (v4.2.1) - React components for Leaflet

## 📁 Project Structure

```
FEDEX/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Card.jsx
│   │   ├── Header.jsx
│   │   ├── KPICard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Table.jsx
│   │   └── Timeline.jsx
│   ├── pages/              # Public pages
│   │   ├── Home.jsx
│   │   └── TrackShipment.jsx
│   ├── dashboards/         # Dashboard pages
│   │   ├── EmployeeDashboard.jsx
│   │   └── ManagerDashboard.jsx
│   ├── charts/             # Chart components
│   │   ├── PerformanceChart.jsx
│   │   ├── RegionChart.jsx
│   │   └── StatusPieChart.jsx
│   ├── maps/               # Map components
│   │   └── ShipmentMap.jsx
│   ├── data/               # Mock data
│   │   └── mockData.js
│   ├── styles/             # Global styles
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global CSS
├── package.json
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 📊 Mock Data

The application uses comprehensive mock data based on real shipment information:

- **5 Sample Shipments** with complete tracking information
- **5 Employee Records** with performance metrics
- **Monthly Performance Data** for charts
- **Regional Performance Statistics**
- **KPI Metrics** for dashboards

### Sample AWB Numbers for Testing
- `6002770480` - Delivered to Canada
- `99193184` - Delivered to UK
- `885670900649` - Delivered to Australia
- `6002771785` - In Transit to USA
- `6002771861` - Out for Delivery to USA

## 🎨 Design Features

### Color Palette
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Accent**: Blue (#0ea5e9)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Animations
- Smooth page transitions
- Animated route lines on maps
- Timeline progress indicators
- Card hover effects
- Loading states

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized for all screen sizes

## 🗺️ Map Features

- **Interactive World Map** using Leaflet
- **Animated Route Lines** between origin and destination
- **Custom Markers** for origin (green) and destination (red)
- **Curved Route Visualization** with Bezier curves
- **Popup Information** on marker click

## 📈 Dashboard Features

### Employee Dashboard
- Total shipments, delivered, in-transit counts
- On-time delivery rate
- Filterable shipment table
- Status-based filtering
- Quick action buttons

### Manager Dashboard
- Revenue and team metrics
- Monthly performance trends (Line Chart)
- Delivery status breakdown (Pie Chart)
- Regional performance comparison (Bar Chart)
- Employee performance table
- Key insights and recommendations
- Quick action panel

## 🔧 Customization

### Adding New Shipments
Edit `src/data/mockData.js` and add to the `shipments` array:

```javascript
{
  id: 6,
  awb: "YOUR_AWB_NUMBER",
  date: "2025-01-XX",
  service: "SERVICE_NAME",
  sender: "SENDER_NAME",
  receiver: "RECEIVER_NAME",
  // ... other fields
}
```

### Modifying Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      accent: { /* your colors */ }
    }
  }
}
```

## 📝 Code Quality

- ✅ Clean component separation
- ✅ Reusable components
- ✅ Well-commented code
- ✅ Consistent naming conventions
- ✅ Responsive layouts
- ✅ Ready for backend integration

## 🔮 Future Enhancements

This MVP is designed to be easily extended with:

- Backend API integration
- Real-time WebSocket updates
- User authentication
- Advanced filtering and search
- Export functionality
- Email notifications
- Mobile app version
- Multi-language support

## 📄 License

This project is created for **AADYAM LOGISTICS PRIVATE LIMITED**.

## 👨‍💻 Development

Built with ❤️ using modern React best practices and professional design patterns.

---

**Note**: This is a UI-only MVP with mock data. No backend logic, authentication, or real API calls are implemented. The platform is ready for backend integration and automation.

## 🎯 Coverage

This MVP covers approximately **80%** of a real logistics platform's visual and functional requirements, including:

- ✅ Shipment tracking
- ✅ Dashboard analytics
- ✅ Performance metrics
- ✅ Team management views
- ✅ Interactive visualizations
- ✅ Responsive design
- ✅ Professional UI/UX

---

**AADYAM LOGISTICS PRIVATE LIMITED** - Your Trusted Logistics Partner
