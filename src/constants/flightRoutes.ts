export const CITIES = [
  { name: 'Kolkata', code: 'CCU', coords: [22.5726, 88.3639] },
  { name: 'Delhi', code: 'DEL', coords: [28.6139, 77.2090] },
  { name: 'Mumbai', code: 'BOM', coords: [19.0760, 72.8777] },
  { name: 'Bangalore', code: 'BLR', coords: [12.9716, 77.5946] },
  { name: 'Goa', code: 'GOI', coords: [15.2993, 74.1240] },
  { name: 'Jaipur', code: 'JAI', coords: [26.9124, 75.7873] },
  { name: 'Chennai', code: 'MAA', coords: [13.0827, 80.2707] },
  { name: 'Pune', code: 'PNQ', coords: [18.5204, 73.8567] },
];

// Haversine formula to calculate distance in km
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return Math.round(R * c);
};

export const generateRoute = (originCode: string, destCode: string) => {
  const origin = CITIES.find(c => c.code === originCode)!;
  const dest = CITIES.find(c => c.code === destCode)!;
  
  const distance = calculateDistance(origin.coords[0], origin.coords[1], dest.coords[0], dest.coords[1]);
  
  // Assign specific durations based on distance buckets
  let duration = 3600; // default 1 hour
  if ((originCode === 'CCU' && destCode === 'DEL') || (originCode === 'DEL' && destCode === 'CCU')) {
    duration = 60; // 1 min test flight
  } else if (distance < 400) {
    duration = 1800; // 30 mins
  } else if (distance < 800) {
    duration = 3600; // 1 hour
  } else if (distance < 1500) {
    duration = 7200; // 2 hours
  } else {
    duration = 10800; // 3 hours
  }

  return {
    from: origin.name,
    fromCode: origin.code,
    to: dest.name,
    toCode: dest.code,
    duration,
    distance,
    fromCoords: origin.coords,
    toCoords: dest.coords
  };
};

export const FLIGHT_ROUTES = [
  { from: 'Kolkata', to: 'Delhi (Test)', duration: 60, fromCoords: [22.5726, 88.3639], toCoords: [28.6139, 77.2090] },
  { from: 'Kolkata', to: 'Dubai', duration: 14400, fromCoords: [22.5726, 88.3639], toCoords: [25.2048, 55.2708] },
  { from: 'Kolkata', to: 'Italy', duration: 28800, fromCoords: [22.5726, 88.3639], toCoords: [41.9028, 12.4964] },
  { from: 'New York', to: 'London', duration: 25200, fromCoords: [40.7128, -74.0060], toCoords: [51.5074, -0.1278] },
  { from: 'Tokyo', to: 'San Francisco', duration: 34200, fromCoords: [35.6762, 139.6503], toCoords: [37.7749, -122.4194] },
];
