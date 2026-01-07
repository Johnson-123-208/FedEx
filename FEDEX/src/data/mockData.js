// Mock shipment data based on real dataset
export const shipments = [
    {
        id: 1,
        awb: "6002770480",
        date: "2025-01-11",
        service: "FEDEX(ICL)",
        sender: "NEELAMRAJU VENKATESHWARA RAO",
        receiver: "SRIKANTH NEELAMRAJU",
        shipmentBy: "ALS",
        destination: "CANADA",
        origin: "INDIA",
        weight: 0.5,
        contents: "MEDICINE",
        status: "delivered",
        currentLocation: "Toronto, Canada",
        estimatedDelivery: "2025-01-15",
        timeline: [
            { status: "Order Placed", date: "2025-01-11 09:00", location: "Hyderabad, India", completed: true },
            { status: "Picked Up", date: "2025-01-11 14:30", location: "Hyderabad Hub", completed: true },
            { status: "In Transit", date: "2025-01-12 08:00", location: "Delhi Gateway", completed: true },
            { status: "International Departure", date: "2025-01-12 22:00", location: "Delhi Airport", completed: true },
            { status: "International Arrival", date: "2025-01-14 06:00", location: "Toronto Airport", completed: true },
            { status: "Out for Delivery", date: "2025-01-15 09:00", location: "Toronto Hub", completed: true },
            { status: "Delivered", date: "2025-01-15 14:30", location: "Toronto, Canada", completed: true }
        ],
        coordinates: {
            origin: { lat: 17.385, lng: 78.486 },
            destination: { lat: 43.651, lng: -79.347 }
        }
    },
    {
        id: 2,
        awb: "99193184",
        date: "2025-01-11",
        service: "UNITED EXPRESS",
        sender: "KOLAKALURI JOSEPH",
        receiver: "BEULAH KOLAKALURI",
        shipmentBy: "ALS",
        destination: "UK",
        origin: "INDIA",
        weight: 21.0,
        contents: "GIFTS",
        status: "delivered",
        currentLocation: "London, UK",
        estimatedDelivery: "2025-01-16",
        timeline: [
            { status: "Order Placed", date: "2025-01-11 10:00", location: "Mumbai, India", completed: true },
            { status: "Picked Up", date: "2025-01-11 15:00", location: "Mumbai Hub", completed: true },
            { status: "In Transit", date: "2025-01-12 09:00", location: "Mumbai Gateway", completed: true },
            { status: "International Departure", date: "2025-01-13 01:00", location: "Mumbai Airport", completed: true },
            { status: "International Arrival", date: "2025-01-15 08:00", location: "London Heathrow", completed: true },
            { status: "Out for Delivery", date: "2025-01-16 10:00", location: "London Hub", completed: true },
            { status: "Delivered", date: "2025-01-16 16:00", location: "London, UK", completed: true }
        ],
        coordinates: {
            origin: { lat: 19.076, lng: 72.877 },
            destination: { lat: 51.507, lng: -0.127 }
        }
    },
    {
        id: 3,
        awb: "885670900649",
        date: "2025-01-11",
        service: "FEDEX(564)",
        sender: "GORREPATI BULLEIAH CHOWDARY",
        receiver: "SRI GORREPATI",
        shipmentBy: "ALS",
        destination: "AUSTRALIA",
        origin: "INDIA",
        weight: 1.0,
        contents: "MEDICINE",
        status: "delivered",
        currentLocation: "Sydney, Australia",
        estimatedDelivery: "2025-01-17",
        timeline: [
            { status: "Order Placed", date: "2025-01-11 11:00", location: "Bangalore, India", completed: true },
            { status: "Picked Up", date: "2025-01-11 16:00", location: "Bangalore Hub", completed: true },
            { status: "In Transit", date: "2025-01-12 10:00", location: "Chennai Gateway", completed: true },
            { status: "International Departure", date: "2025-01-13 23:00", location: "Chennai Airport", completed: true },
            { status: "International Arrival", date: "2025-01-16 12:00", location: "Sydney Airport", completed: true },
            { status: "Out for Delivery", date: "2025-01-17 08:00", location: "Sydney Hub", completed: true },
            { status: "Delivered", date: "2025-01-17 15:00", location: "Sydney, Australia", completed: true }
        ],
        coordinates: {
            origin: { lat: 12.971, lng: 77.594 },
            destination: { lat: -33.868, lng: 151.209 }
        }
    },
    {
        id: 4,
        awb: "6002771785",
        date: "2025-01-11",
        service: "FEDEX(ICL)",
        sender: "SRIRAMINENI SREERAM",
        receiver: "DENINENI VINOD",
        shipmentBy: "ALS",
        destination: "USA",
        origin: "INDIA",
        weight: 28.0,
        contents: "GIFTS",
        status: "in_transit",
        currentLocation: "New York Gateway",
        estimatedDelivery: "2025-01-18",
        timeline: [
            { status: "Order Placed", date: "2025-01-11 12:00", location: "Hyderabad, India", completed: true },
            { status: "Picked Up", date: "2025-01-11 17:00", location: "Hyderabad Hub", completed: true },
            { status: "In Transit", date: "2025-01-12 11:00", location: "Delhi Gateway", completed: true },
            { status: "International Departure", date: "2025-01-14 02:00", location: "Delhi Airport", completed: true },
            { status: "International Arrival", date: "2025-01-16 18:00", location: "JFK Airport", completed: true },
            { status: "Out for Delivery", date: "2025-01-18 09:00", location: "New York Hub", completed: false },
            { status: "Delivered", date: "2025-01-18 16:00", location: "New York, USA", completed: false }
        ],
        coordinates: {
            origin: { lat: 17.385, lng: 78.486 },
            destination: { lat: 40.712, lng: -74.006 }
        }
    },
    {
        id: 5,
        awb: "6002771861",
        date: "2025-01-11",
        service: "FEDEX(ICL)",
        sender: "B L NAVEEN KUMAR GUPTA",
        receiver: "SRIDEVI GUDOOR",
        shipmentBy: "ALS",
        destination: "USA",
        origin: "INDIA",
        weight: 6.5,
        contents: "GIFTS",
        status: "out_for_delivery",
        currentLocation: "Los Angeles Hub",
        estimatedDelivery: "2025-01-19",
        timeline: [
            { status: "Order Placed", date: "2025-01-11 13:00", location: "Chennai, India", completed: true },
            { status: "Picked Up", date: "2025-01-11 18:00", location: "Chennai Hub", completed: true },
            { status: "In Transit", date: "2025-01-12 12:00", location: "Mumbai Gateway", completed: true },
            { status: "International Departure", date: "2025-01-14 03:00", location: "Mumbai Airport", completed: true },
            { status: "International Arrival", date: "2025-01-17 10:00", location: "LAX Airport", completed: true },
            { status: "Out for Delivery", date: "2025-01-19 08:00", location: "Los Angeles Hub", completed: true },
            { status: "Delivered", date: "2025-01-19 15:00", location: "Los Angeles, USA", completed: false }
        ],
        coordinates: {
            origin: { lat: 13.082, lng: 80.270 },
            destination: { lat: 34.052, lng: -118.243 }
        }
    }
];

// Employee performance data
export const employeeData = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "Delivery Agent",
        deliveries: 156,
        onTime: 148,
        delayed: 8,
        rating: 4.8,
        efficiency: 95,
        region: "North"
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Logistics Coordinator",
        deliveries: 203,
        onTime: 195,
        delayed: 8,
        rating: 4.9,
        efficiency: 96,
        region: "South"
    },
    {
        id: 3,
        name: "Amit Patel",
        role: "Warehouse Manager",
        deliveries: 178,
        onTime: 165,
        delayed: 13,
        rating: 4.6,
        efficiency: 93,
        region: "West"
    },
    {
        id: 4,
        name: "Sneha Reddy",
        role: "Delivery Agent",
        deliveries: 189,
        onTime: 182,
        delayed: 7,
        rating: 4.9,
        efficiency: 96,
        region: "South"
    },
    {
        id: 5,
        name: "Vikram Singh",
        role: "Operations Lead",
        deliveries: 145,
        onTime: 138,
        delayed: 7,
        rating: 4.7,
        efficiency: 95,
        region: "North"
    }
];

// KPI data for dashboards
export const kpiData = {
    totalShipments: 1247,
    delivered: 1089,
    inTransit: 98,
    pending: 60,
    avgDeliveryTime: "4.2 days",
    onTimeRate: 94.5,
    customerSatisfaction: 4.7
};

// Chart data for manager dashboard
export const monthlyPerformance = [
    { month: 'Jan', deliveries: 245, onTime: 232, delayed: 13 },
    { month: 'Feb', deliveries: 298, onTime: 285, delayed: 13 },
    { month: 'Mar', deliveries: 312, onTime: 298, delayed: 14 },
    { month: 'Apr', deliveries: 289, onTime: 275, delayed: 14 },
    { month: 'May', deliveries: 334, onTime: 320, delayed: 14 },
    { month: 'Jun', deliveries: 356, onTime: 342, delayed: 14 }
];

export const deliveryStatusBreakdown = [
    { name: 'Delivered', value: 1089, color: '#10b981' },
    { name: 'In Transit', value: 98, color: '#3b82f6' },
    { name: 'Pending', value: 60, color: '#f59e0b' },
    { name: 'Delayed', value: 15, color: '#ef4444' }
];

export const regionPerformance = [
    { region: 'North', shipments: 345, efficiency: 95 },
    { region: 'South', shipments: 412, efficiency: 96 },
    { region: 'East', shipments: 298, efficiency: 92 },
    { region: 'West', shipments: 367, efficiency: 94 }
];

// World cities for map animation
export const worldCities = [
    { name: "New York", lat: 40.712, lng: -74.006, country: "USA" },
    { name: "London", lat: 51.507, lng: -0.127, country: "UK" },
    { name: "Toronto", lat: 43.651, lng: -79.347, country: "Canada" },
    { name: "Sydney", lat: -33.868, lng: 151.209, country: "Australia" },
    { name: "Tokyo", lat: 35.689, lng: 139.691, country: "Japan" },
    { name: "Dubai", lat: 25.276, lng: 55.296, country: "UAE" },
    { name: "Singapore", lat: 1.352, lng: 103.819, country: "Singapore" },
    { name: "Paris", lat: 48.856, lng: 2.352, country: "France" },
    { name: "Berlin", lat: 52.520, lng: 13.404, country: "Germany" },
    { name: "Mumbai", lat: 19.076, lng: 72.877, country: "India" },
    { name: "Hyderabad", lat: 17.385, lng: 78.486, country: "India" },
    { name: "Bangalore", lat: 12.971, lng: 77.594, country: "India" },
    { name: "Chennai", lat: 13.082, lng: 80.270, country: "India" },
    { name: "Delhi", lat: 28.704, lng: 77.102, country: "India" }
];
