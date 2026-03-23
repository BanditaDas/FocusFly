import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Simulation from './components/Simulation';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<any | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [journeys, setJourneys] = useState(0);

  const handleBookFlight = (route: any) => {
    setCurrentRoute(route);
  };

  const handleEndFlight = (completed: boolean, secondsFlown: number) => {
    if (completed) {
      setTotalSeconds(prev => prev + secondsFlown);
      setJourneys(prev => prev + 1);
    } else {
      setTotalSeconds(prev => prev + secondsFlown);
    }
    setCurrentRoute(null);
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-slate-950 text-white">
      {currentRoute ? (
        <Simulation route={currentRoute} onEndFlight={handleEndFlight} />
      ) : (
        <Dashboard 
          onBookFlight={handleBookFlight} 
          totalSeconds={totalSeconds}
          journeys={journeys}
        />
      )}
    </div>
  );
}
