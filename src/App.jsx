import { useState } from 'react';
import Home from './screens/Home';
import Journey from './screens/Journey';
import Stations from './screens/Stations';
import Restaurants from './screens/Restaurants';
import Menu from './screens/Menu';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import Confirmed from './screens/Confirmed';
import DemoControls from './components/DemoControls';

const DEMO_SCREENS = ['journey', 'stations', 'restaurants', 'menu'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [journey, setJourney] = useState(null);
  const [delayMins, setDelayMins] = useState(0);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleAddToCart = (item, action) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        if (action === 'remove') {
          return existing.qty === 1
            ? prevCart.filter((c) => c.id !== item.id)
            : prevCart.map((c) => (c.id === item.id ? { ...c, qty: c.qty - 1 } : c));
        }
        return prevCart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const renderScreen = () => {
    if (screen === 'home') {
      return (
        <Home
          onFound={(j) => {
            setJourney(j);
            setDelayMins(j.booking.currentDelayMins);
            setScreen('journey');
          }}
        />
      );
    }

    if (screen === 'journey' && journey) {
      return (
        <Journey
          journey={journey}
          delayMins={delayMins}
          onBack={() => setScreen('home')}
          onContinue={() => setScreen('stations')}
        />
      );
    }

    if (screen === 'stations') {
      return (
        <Stations
          journey={journey}
          delayMins={delayMins}
          onBack={() => setScreen('journey')}
          onSelectStation={(station) => {
            setSelectedStation(station);
            setScreen('restaurants');
          }}
        />
      );
    }

    if (screen === 'restaurants') {
      return (
        <Restaurants
          station={selectedStation}
          journey={journey}
          delayMins={delayMins}
          onBack={() => setScreen('stations')}
          onSelectRestaurant={(restaurant) => {
            setSelectedRestaurant(restaurant);
            setCart([]);
            setScreen('menu');
          }}
        />
      );
    }

    if (screen === 'menu') {
      return (
        <div className="relative">
          <Menu
            restaurant={selectedRestaurant}
            cart={cart}
            onAddToCart={handleAddToCart}
            onBack={() => setScreen('restaurants')}
          />
          {cartCount > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg flex justify-center z-40">
              <div
                onClick={() => setScreen('cart')}
                className="w-full max-w-md bg-[#FC8019] text-white p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-orange-600"
              >
                <span className="font-semibold">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} | ₹{cartTotal}
                </span>
                <span className="font-bold">View Cart</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (screen === 'cart') {
      return (
        <Cart
          cart={cart}
          station={selectedStation}
          coach={journey.booking.coach}
          seat={journey.booking.seat}
          onBack={() => setScreen('menu')}
          onUpdateQty={handleAddToCart}
          onCheckout={() => setScreen('checkout')}
        />
      );
    }

    if (screen === 'checkout') {
      return (
        <Checkout
          cart={cart}
          onBack={() => setScreen('cart')}
          onPay={(method) => {
            setPaymentMethod(method);
            setScreen('confirmed');
          }}
        />
      );
    }

    if (screen === 'confirmed') {
      return (
        <Confirmed
          journey={journey}
          station={selectedStation}
          paymentMethod={paymentMethod}
          cart={cart}
          onDone={() => {
            setScreen('home');
            setJourney(null);
            setCart([]);
            setSelectedStation(null);
            setSelectedRestaurant(null);
            setDelayMins(0);
          }}
        />
      );
    }

    return null;
  };

  return (
    <>
      {renderScreen()}
      {journey && DEMO_SCREENS.includes(screen) && (
        <DemoControls
          delayMins={delayMins}
          onSimulate={() => setDelayMins((d) => d + 40)}
          onReset={() => setDelayMins(journey.booking.currentDelayMins)}
        />
      )}
    </>
  );
}