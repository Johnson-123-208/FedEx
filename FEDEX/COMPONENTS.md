# 📚 COMPONENT DOCUMENTATION

## AADYAM LOGISTICS - Component Reference Guide

---

## 🧩 Core Components

### 1. Card Component
**Location**: `src/components/Card.jsx`

**Purpose**: Reusable card container with animations

**Props**:
- `children` (ReactNode) - Card content
- `className` (string) - Additional CSS classes
- `hover` (boolean) - Enable hover effect (default: true)
- `gradient` (boolean) - Enable gradient background (default: false)

**Usage**:
```jsx
<Card hover={true} gradient={false}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

### 2. Header Component
**Location**: `src/components/Header.jsx`

**Purpose**: Navigation header with routing

**Features**:
- Responsive navigation
- Active route highlighting
- Mobile menu
- Company branding

**Usage**:
```jsx
<Header />
```

---

### 3. KPICard Component
**Location**: `src/components/KPICard.jsx`

**Purpose**: Display key performance indicators

**Props**:
- `title` (string) - KPI title
- `value` (string|number) - KPI value
- `icon` (string) - Icon (emoji or text)
- `trend` (string) - Trend direction ('up'|'down')
- `trendValue` (string) - Trend percentage
- `color` (string) - Color theme ('blue'|'green'|'yellow'|'red'|'purple'|'indigo')

**Usage**:
```jsx
<KPICard
  title="Total Shipments"
  value={1247}
  icon="📦"
  trend="up"
  trendValue="12%"
  color="blue"
/>
```

---

### 4. StatusBadge Component
**Location**: `src/components/StatusBadge.jsx`

**Purpose**: Display shipment status with color coding

**Props**:
- `status` (string) - Status value
- `size` (string) - Badge size ('sm'|'md'|'lg')

**Status Types**:
- `delivered` - Green
- `in_transit` - Blue
- `pending` - Yellow
- `delayed` - Red
- `out_for_delivery` - Indigo

**Usage**:
```jsx
<StatusBadge status="delivered" size="md" />
```

---

### 5. Table Component
**Location**: `src/components/Table.jsx`

**Purpose**: Sortable and filterable data table

**Props**:
- `data` (array) - Table data
- `columns` (array) - Column definitions
- `sortable` (boolean) - Enable sorting (default: true)
- `filterable` (boolean) - Enable filtering (default: false)

**Column Definition**:
```javascript
{
  key: 'fieldName',
  label: 'Column Label',
  render: (value, row) => <CustomComponent />  // Optional
}
```

**Usage**:
```jsx
<Table
  data={shipments}
  columns={columns}
  sortable={true}
  filterable={true}
/>
```

---

### 6. Timeline Component
**Location**: `src/components/Timeline.jsx`

**Purpose**: Animated tracking timeline

**Props**:
- `timeline` (array) - Timeline data

**Timeline Item Structure**:
```javascript
{
  status: 'Status Name',
  date: '2025-01-11 09:00',
  location: 'Location Name',
  completed: true|false
}
```

**Usage**:
```jsx
<Timeline timeline={shipment.timeline} />
```

---

## 📊 Chart Components

### 7. PerformanceChart Component
**Location**: `src/charts/PerformanceChart.jsx`

**Purpose**: Line chart for performance trends

**Props**:
- `data` (array) - Chart data
- `title` (string) - Chart title

**Data Structure**:
```javascript
[
  { month: 'Jan', deliveries: 245, onTime: 232, delayed: 13 },
  // ...
]
```

**Usage**:
```jsx
<PerformanceChart
  data={monthlyPerformance}
  title="Monthly Performance Trends"
/>
```

---

### 8. StatusPieChart Component
**Location**: `src/charts/StatusPieChart.jsx`

**Purpose**: Pie chart for status distribution

**Props**:
- `data` (array) - Chart data
- `title` (string) - Chart title

**Data Structure**:
```javascript
[
  { name: 'Delivered', value: 1089, color: '#10b981' },
  // ...
]
```

**Usage**:
```jsx
<StatusPieChart
  data={deliveryStatusBreakdown}
  title="Delivery Status Breakdown"
/>
```

---

### 9. RegionChart Component
**Location**: `src/charts/RegionChart.jsx`

**Purpose**: Bar chart for regional comparison

**Props**:
- `data` (array) - Chart data
- `title` (string) - Chart title

**Data Structure**:
```javascript
[
  { region: 'North', shipments: 345, efficiency: 95 },
  // ...
]
```

**Usage**:
```jsx
<RegionChart
  data={regionPerformance}
  title="Regional Performance Comparison"
/>
```

---

## 🗺️ Map Components

### 10. ShipmentMap Component
**Location**: `src/maps/ShipmentMap.jsx`

**Purpose**: Interactive map with animated routes

**Props**:
- `shipment` (object) - Shipment data with coordinates
- `animated` (boolean) - Enable route animation (default: true)

**Shipment Structure**:
```javascript
{
  origin: 'Country Name',
  destination: 'Country Name',
  coordinates: {
    origin: { lat: 17.385, lng: 78.486 },
    destination: { lat: 43.651, lng: -79.347 }
  }
}
```

**Usage**:
```jsx
<ShipmentMap shipment={shipmentData} animated={true} />
```

---

## 📄 Page Components

### 11. Home Page
**Location**: `src/pages/Home.jsx`

**Features**:
- Hero section
- Stats display
- Features showcase
- CTA sections
- Footer

**Route**: `/`

---

### 12. TrackShipment Page
**Location**: `src/pages/TrackShipment.jsx`

**Features**:
- AWB search
- Shipment details
- Animated timeline
- Interactive map
- Status display

**Route**: `/track`

---

### 13. EmployeeDashboard
**Location**: `src/dashboards/EmployeeDashboard.jsx`

**Features**:
- KPI cards
- Quick stats
- Filterable table
- Status filters
- Quick actions

**Route**: `/employee-dashboard`

---

### 14. ManagerDashboard
**Location**: `src/dashboards/ManagerDashboard.jsx`

**Features**:
- KPI cards
- Performance metrics
- 3 interactive charts
- Employee table
- Insights panel
- Quick actions

**Route**: `/manager-dashboard`

---

## 📦 Data Structure

### Mock Data Location
**File**: `src/data/mockData.js`

### Available Exports:

#### 1. shipments
Array of shipment objects with tracking data

#### 2. employeeData
Array of employee performance data

#### 3. kpiData
Object with key performance indicators

#### 4. monthlyPerformance
Array of monthly performance data

#### 5. deliveryStatusBreakdown
Array of status distribution data

#### 6. regionPerformance
Array of regional performance data

#### 7. worldCities
Array of city coordinates for map

---

## 🎨 Styling Guide

### Tailwind Classes

#### Gradients
```css
bg-gradient-to-r from-purple-600 to-blue-500
```

#### Glassmorphism
```css
glass          /* Light glass effect */
glass-dark     /* Dark glass effect */
```

#### Gradient Text
```css
gradient-text  /* Purple to blue gradient text */
```

#### Status Badges
```css
status-delivered
status-in-transit
status-pending
status-delayed
status-out-for-delivery
```

#### Buttons
```css
btn-primary    /* Primary gradient button */
btn-secondary  /* Secondary outline button */
```

#### Card Effects
```css
card-hover     /* Hover lift effect */
```

---

## 🔧 Utility Functions

### Custom Hooks
None currently - all components use standard React hooks

### Helper Functions
All rendering logic is contained within components

---

## 📱 Responsive Breakpoints

```javascript
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

---

## 🎯 Best Practices

### Component Usage

1. **Always import from correct path**
   ```jsx
   import Card from '../components/Card';
   ```

2. **Pass required props**
   ```jsx
   <KPICard title="..." value="..." icon="..." color="..." />
   ```

3. **Use consistent naming**
   - Components: PascalCase
   - Props: camelCase
   - Files: PascalCase.jsx

4. **Maintain prop types**
   - Check component documentation for required props
   - Use default values when available

---

## 🚀 Creating New Components

### Template:
```jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {type} props.propName - Prop description
 */
const ComponentName = ({ propName }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="your-classes"
    >
      {/* Component content */}
    </motion.div>
  );
};

export default ComponentName;
```

---

## 📚 Additional Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Recharts**: https://recharts.org/
- **Leaflet**: https://leafletjs.com/
- **React Router**: https://reactrouter.com/

---

**AADYAM LOGISTICS PRIVATE LIMITED**
*Component Documentation v1.0*
