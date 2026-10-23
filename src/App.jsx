import { useState } from 'react';
import { calcBill } from './data';
import { getRestaurantStatus } from './utils/rules';
import Home from './screens/Home';
import Journey from './screens/Journey';
import Stations from './screens/Stations';
import Restaurants from './screens/Restaurants';
import Menu from './screens/Menu';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import Confirmed from './screens/Confirmed';
import Tracking from './screens/Tracking';
import BeforeAfter from './screens/BeforeAfter';
import DemoControls from './components/DemoControls';

const DEMO_SCREENS = ['journey', 'stations', 'restaurants', 'menu', 'tracking'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [journey, setJourney] = useState(null);
  const [delayMins, setDelayMins] = useState(0);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [order, setOrder] = useState(null);

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

  const placeOrder = (method) => {
    setPaymentMethod(method);
    setOrder({
      id: 'RD' + Math.floor(100000 + Math.random() * 900000),
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      station: selectedStation,
      restaurant: selectedRestaurant,
      items: cart,
      bill: calcBill(cart),
      placedDelayMins: delayMins,
      coach: journey.booking.coach,
      seat: journey.booking.seat,
    });
    setScreen('confirmed');
  };

  const resetAll = () => {
    setScreen('home');
    setJourney(null);
    setDelayMins(0);
    setSelectedStation(null);
    setSelectedRestaurant(null);
    setCart([]);
    setCustomer({ name: '', phone: '' });
    setPaymentMethod('');
    setOrder(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const menuStatus =
    journey && selectedStation && selectedRestaurant
      ? getRestaurantStatus(selectedRestaurant, selectedStation, delayMins, journey.booking.nowTime)
      : null;

  const renderScreen = () => {
    if (screen === 'beforeafter') {
      return <BeforeAfter onBack={() => setScreen('home')} />;
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

    if (screen === 'stations' && journey) {
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

    if (screen === 'restaurants' && journey && selectedStation) {
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

    if (screen === 'menu' && menuStatus) {
      return (
        <div className="relative">
          <Menu
            restaurant={selectedRestaurant}
            status={menuStatus}
            cart={cart}
            onAddToCart={handleAddToCart}
            onBack={() => setScreen('restaurants')}
          />
          {cartCount > 0 && menuStatus.status === 'open' && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg flex justify-center z-40">
              <div
                onClick={() => setScreen('cart')}
                className="w-full max-w-md bg-[#FC8019] text-white p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-orange-600"
              >
                <span className="font-semibold">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} | ₹{cartTotal}
                </span>
                <span className="font-bold">View cart</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (screen === 'cart' && journey && selectedStation) {
      return (
        <Cart
          cart={cart}
          station={selectedStation}
          coach={journey.booking.coach}
          seat={journey.booking.seat}
          customer={customer}
          onCustomerChange={(field, value) => setCustomer((prev) => ({ ...prev, [field]: value }))}
          onBack={() => setScreen('menu')}
          onUpdateQty={handleAddToCart}
          onCheckout={() => setScreen('checkout')}
        />
      );
    }

    if (screen === 'checkout') {
      return <Checkout cart={cart} onBack={() => setScreen('cart')} onPay={placeOrder} />;
    }

    if (screen === 'confirmed' && order) {
      return (
        <Confirmed
          order={order}
          customer={customer}
          paymentMethod={paymentMethod}
          onTrack={() => setScreen('tracking')}
          onDone={resetAll}
        />
      );
    }

    if (screen === 'tracking' && order) {
      return (
        <Tracking
          order={order}
          customer={customer}
          delayMins={delayMins}
          onChangeStation={() => {
            setCart([]);
            setOrder(null);
            setSelectedRestaurant(null);
            setScreen('stations');
          }}
          onHome={resetAll}
        />
      );
    }

    return (
      <Home
        onCompare={() => setScreen('beforeafter')}
        onFound={(j) => {
          setJourney(j);
          setDelayMins(j.booking.currentDelayMins);
          setCustomer({ name: j.booking.passenger, phone: j.booking.phone });
          setScreen('journey');
        }}
      />
    );
  };

  return (
    <>
      {renderScreen()}
      {journey && DEMO_SCREENS.includes(screen) && (
        <DemoControls
          delayMins={delayMins}
          originalDelay={journey.booking.currentDelayMins}
          onSimulate={() => setDelayMins((d) => d + 40)}
          onReset={() => setDelayMins(journey.booking.currentDelayMins)}
        />
      )}
    </>
  );
}
