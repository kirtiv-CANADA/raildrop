import { useState } from 'react';
import { calcBill, anchorToDeviceClock, getJourneyByPnr, menuFor, RESTAURANTS } from './data';
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

const DEMO_SCREENS = ['home', 'journey', 'stations', 'restaurants', 'menu', 'tracking'];
const MAIN_DEMO_PNR = '7305148296';

// Ready-made states for the demo controls ("Jump to a scene").
const SCENES = [
  { id: 'journey', label: '1. Can I order right now?' },
  { id: 'restaurants', label: '2. Restaurants after a delay' },
  { id: 'tracking-moved', label: '3. Window moves after ordering' },
  { id: 'tracking-closed', label: '4. Restaurant closes, refund' },
  { id: 'beforeafter', label: '5. Before and after' },
];

function makeOrder(journey, station, restaurant, items, placedDelayMins) {
  return {
    id: 'RD' + Math.floor(100000 + Math.random() * 900000),
    otp: String(Math.floor(1000 + Math.random() * 9000)),
    station,
    restaurant,
    items,
    bill: calcBill(items),
    placedDelayMins,
    coach: journey.booking.coach,
    seat: journey.booking.seat,
  };
}

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
    setOrder(makeOrder(journey, selectedStation, selectedRestaurant, cart, delayMins));
    setScreen('confirmed');
  };

  // Opens a ready-made state of the main demo (for the demo controls).
  const jumpToScene = (sceneId) => {
    if (sceneId === 'beforeafter') {
      setScreen('beforeafter');
      return;
    }

    const j = getJourneyByPnr(MAIN_DEMO_PNR);
    const baseDelay = j.booking.currentDelayMins;
    const station = j.deliverableStops[0]; // New Delhi, the boarding station
    const restaurant = RESTAURANTS.find((r) => r.id === 'r16'); // Dilli Rasoi Kitchen
    const menu = menuFor(restaurant);
    const items = ['thali', 'chai']
      .map((id) => menu.find((m) => m.id === id))
      .filter(Boolean)
      .map((m) => ({ ...m, qty: 1 }));

    anchorToDeviceClock(j.booking);
    setJourney(j);
    setCustomer({ name: j.booking.passenger, phone: j.booking.phone });
    setSelectedStation(station);
    setSelectedRestaurant(restaurant);
    setPaymentMethod('UPI (GPay/PhonePe)');
    setCart([]);
    setOrder(null);

    if (sceneId === 'journey') {
      setDelayMins(baseDelay);
      setScreen('journey');
    } else if (sceneId === 'restaurants') {
      setDelayMins(baseDelay + 40);
      setScreen('restaurants');
    } else if (sceneId === 'tracking-moved') {
      setCart(items);
      setOrder(makeOrder(j, station, restaurant, items, baseDelay));
      setDelayMins(baseDelay + 40);
      setScreen('tracking');
    } else if (sceneId === 'tracking-closed') {
      setCart(items);
      setOrder(makeOrder(j, station, restaurant, items, baseDelay));
      setDelayMins(baseDelay + 80);
      setScreen('tracking');
    }
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
          anchorToDeviceClock(j.booking);
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
      {DEMO_SCREENS.includes(screen) && (
        <DemoControls
          key={journey ? 'live' : 'idle'}
          hasJourney={Boolean(journey)}
          defaultOpen={Boolean(journey)}
          delayMins={delayMins}
          originalDelay={journey ? journey.booking.currentDelayMins : 0}
          scenes={SCENES}
          onSimulate={() => setDelayMins((d) => d + 40)}
          onReset={() => setDelayMins(journey.booking.currentDelayMins)}
          onScene={jumpToScene}
        />
      )}
    </>
  );
}