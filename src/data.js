// RailDrop sample data. All trains, PNRs, restaurants and prices are made up for the prototype.

// ---------- Helpers ----------
export function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = (h * 60 + m + mins) % (24 * 60);
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatDelay(mins) {
  if (mins <= 0) return 'On time';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h ? h + ' hr ' : ''}${m ? m + ' min' : ''}`.trim() + ' late';
}

// ---------- Trains ----------
export const TRAINS = {
  '12961': {
    number: '12961',
    name: 'Indore - Delhi Express (sample)',
    stops: [
      { code: 'INDB', name: 'Indore Jn', arrival: '17:05', haltMins: 0 },
      { code: 'UJN', name: 'Ujjain Jn', arrival: '18:10', haltMins: 5 },
      { code: 'BPL', name: 'Bhopal Jn', arrival: '21:00', haltMins: 10 },
      { code: 'JHS', name: 'Jhansi Jn', arrival: '01:15', haltMins: 10 },
      { code: 'GWL', name: 'Gwalior Jn', arrival: '02:40', haltMins: 5 },
      { code: 'AGC', name: 'Agra Cantt', arrival: '04:05', haltMins: 5 },
      { code: 'NZM', name: 'Hazrat Nizamuddin', arrival: '06:50', haltMins: 0 },
    ],
  },
  '12185': {
    number: '12185',
    name: 'Bhopal - Mumbai Superfast (sample)',
    stops: [
      { code: 'BPL', name: 'Bhopal Jn', arrival: '08:30', haltMins: 0 },
      { code: 'ET', name: 'Itarsi Jn', arrival: '09:50', haltMins: 10 },
      { code: 'KNW', name: 'Khandwa', arrival: '11:45', haltMins: 5 },
      { code: 'BSL', name: 'Bhusaval Jn', arrival: '13:35', haltMins: 10 },
      { code: 'NK', name: 'Nashik Road', arrival: '16:30', haltMins: 5 },
      { code: 'CSMT', name: 'Mumbai CSMT', arrival: '20:45', haltMins: 0 },
    ],
  },
};

// ---------- PNR test data (any of these will work in the demo) ----------
// currentDelayMins = how late the train is when the passenger opens the app.
export const PNRS = {
  '4521879630': {
    pnr: '4521879630',
    trainNumber: '12961',
    passenger: 'Kirti Sharma',
    phone: '9876543210',
    coach: 'B2',
    seat: 34,
    berth: 'Lower',
    boardingCode: 'INDB',
    destinationCode: 'NZM',
    currentDelayMins: 120,
    note: 'Heavy delay: 2 hours late',
  },
  '2837461950': {
    pnr: '2837461950',
    trainNumber: '12961',
    passenger: 'Rohit Verma',
    phone: '9812345670',
    coach: 'S5',
    seat: 61,
    berth: 'Side Upper',
    boardingCode: 'UJN',
    destinationCode: 'AGC',
    currentDelayMins: 35,
    note: 'Small delay: 35 min late',
  },
  '6104928375': {
    pnr: '6104928375',
    trainNumber: '12185',
    passenger: 'Anjali Patil',
    phone: '9922334455',
    coach: 'A1',
    seat: 8,
    berth: 'Lower',
    boardingCode: 'BPL',
    destinationCode: 'CSMT',
    currentDelayMins: 0,
    note: 'Train is on time',
  },
};

export function getJourneyByPnr(pnr) {
  const booking = PNRS[pnr];
  if (!booking) return null;
  const train = TRAINS[booking.trainNumber];
  const startIdx = train.stops.findIndex((s) => s.code === booking.boardingCode);
  const endIdx = train.stops.findIndex((s) => s.code === booking.destinationCode);
  // Only stops after boarding and before the destination are valid for delivery.
  const deliverableStops = train.stops.slice(startIdx + 1, endIdx + 1).filter((s) => s.haltMins > 0);
  return { booking, train, deliverableStops };
}

// ---------- Menu catalog (shared items; each restaurant picks some and sets a price factor) ----------
export const CATALOG = {
  thali: { id: 'thali', name: 'Special Veg Thali', category: 'Meals', veg: true, price: 160, desc: '2 sabzi, dal, rice, 4 roti, salad, sweet' },
  minithali: { id: 'minithali', name: 'Mini Veg Thali', category: 'Meals', veg: true, price: 110, desc: '1 sabzi, dal, rice, 3 roti' },
  dalrice: { id: 'dalrice', name: 'Dal Tadka Rice', category: 'Meals', veg: true, price: 120, desc: 'Yellow dal with jeera rice' },
  rajma: { id: 'rajma', name: 'Rajma Chawal', category: 'Meals', veg: true, price: 125, desc: 'Home-style rajma with steamed rice' },
  chholebhature: { id: 'chholebhature', name: 'Chole Bhature', category: 'Meals', veg: true, price: 130, desc: '2 bhature with spicy chole' },
  paneerbutter: { id: 'paneerbutter', name: 'Paneer Butter Masala + 3 Roti', category: 'Meals', veg: true, price: 190, desc: 'Creamy paneer gravy with butter roti' },
  vegbiryani: { id: 'vegbiryani', name: 'Veg Biryani', category: 'Biryani', veg: true, price: 170, desc: 'With raita' },
  chickenbiryani: { id: 'chickenbiryani', name: 'Chicken Biryani', category: 'Biryani', veg: false, price: 220, desc: '2 pieces, with raita' },
  eggbiryani: { id: 'eggbiryani', name: 'Egg Biryani', category: 'Biryani', veg: false, price: 160, desc: '2 eggs, with raita' },
  butterchicken: { id: 'butterchicken', name: 'Butter Chicken + 3 Roti', category: 'Meals', veg: false, price: 260, desc: 'Boneless chicken in butter gravy' },
  chickenburger: { id: 'chickenburger', name: 'Crispy Chicken Burger', category: 'Snacks', veg: false, price: 130, desc: 'Crispy fillet, lettuce, mayo' },
  vegburger: { id: 'vegburger', name: 'Aloo Tikki Burger', category: 'Snacks', veg: true, price: 80, desc: 'Potato patty with cheese slice' },
  paneerwrap: { id: 'paneerwrap', name: 'Paneer Tikka Wrap', category: 'Snacks', veg: true, price: 110, desc: 'Grilled paneer in a whole wheat wrap' },
  samosa: { id: 'samosa', name: 'Samosa (2 pcs)', category: 'Snacks', veg: true, price: 40, desc: 'With green chutney' },
  kachori: { id: 'kachori', name: 'Pyaaz Kachori (2 pcs)', category: 'Snacks', veg: true, price: 50, desc: 'Crispy, served hot' },
  sandwich: { id: 'sandwich', name: 'Veg Grilled Sandwich', category: 'Snacks', veg: true, price: 70, desc: 'Cheese, onion, tomato, capsicum' },
  poha: { id: 'poha', name: 'Indori Poha', category: 'Snacks', veg: true, price: 45, desc: 'With sev and jalebi' },
  chai: { id: 'chai', name: 'Masala Chai', category: 'Beverages', veg: true, price: 20, desc: 'Cutting chai, 150 ml' },
  coffee: { id: 'coffee', name: 'Hot Coffee', category: 'Beverages', veg: true, price: 30, desc: 'Milk coffee' },
  lassi: { id: 'lassi', name: 'Sweet Lassi', category: 'Beverages', veg: true, price: 60, desc: 'Thick curd lassi, 300 ml' },
  water: { id: 'water', name: 'Packaged Water (1 L)', category: 'Beverages', veg: true, price: 20, desc: '' },
  gulabjamun: { id: 'gulabjamun', name: 'Gulab Jamun (2 pcs)', category: 'Desserts', veg: true, price: 50, desc: 'Served warm' },
};

// ---------- Restaurants by station ----------
export const RESTAURANTS = [
  { id: 'r1', station: 'UJN', name: 'Mahakal Bhojnalay', cuisine: 'North Indian, Thali', rating: 4.3, ratingCount: 1240, vegOnly: true, prepMins: 20, priceFactor: 1.0, items: ['thali', 'minithali', 'dalrice', 'kachori', 'samosa', 'poha', 'chai', 'lassi', 'water', 'gulabjamun'] },
  { id: 'r2', station: 'UJN', name: 'Station Snack Point', cuisine: 'Snacks, Fast Food', rating: 4.0, ratingCount: 610, vegOnly: false, prepMins: 15, priceFactor: 0.95, items: ['vegburger', 'chickenburger', 'sandwich', 'samosa', 'kachori', 'chai', 'coffee', 'water'] },

  { id: 'r3', station: 'BPL', name: 'Shahjahani Biryani House', cuisine: 'Biryani, Mughlai', rating: 4.4, ratingCount: 3120, vegOnly: false, prepMins: 25, priceFactor: 1.05, items: ['chickenbiryani', 'eggbiryani', 'vegbiryani', 'butterchicken', 'paneerbutter', 'lassi', 'gulabjamun', 'water'] },
  { id: 'r4', station: 'BPL', name: 'Annapurna Pure Veg', cuisine: 'North Indian, Thali', rating: 4.2, ratingCount: 1875, vegOnly: true, prepMins: 20, priceFactor: 1.0, items: ['thali', 'minithali', 'rajma', 'chholebhature', 'paneerbutter', 'chai', 'lassi', 'gulabjamun'] },
  { id: 'r5', station: 'BPL', name: 'Rail Cafe Express', cuisine: 'Burgers, Wraps, Beverages', rating: 3.9, ratingCount: 480, vegOnly: false, prepMins: 15, priceFactor: 1.1, items: ['chickenburger', 'vegburger', 'paneerwrap', 'sandwich', 'chai', 'coffee', 'water'] },

  { id: 'r6', station: 'JHS', name: 'Bundelkhand Dhaba', cuisine: 'North Indian, Dhaba', rating: 4.1, ratingCount: 960, vegOnly: false, prepMins: 25, priceFactor: 0.95, items: ['thali', 'dalrice', 'rajma', 'paneerbutter', 'butterchicken', 'chickenbiryani', 'chai', 'lassi'] },
  { id: 'r7', station: 'JHS', name: 'Jhansi Chaat & Chai', cuisine: 'Snacks, Chai', rating: 4.0, ratingCount: 410, vegOnly: true, prepMins: 10, priceFactor: 0.9, items: ['samosa', 'kachori', 'sandwich', 'vegburger', 'chai', 'coffee', 'lassi', 'water'] },

  { id: 'r8', station: 'GWL', name: 'Fort View Restaurant', cuisine: 'North Indian, Chinese', rating: 4.2, ratingCount: 780, vegOnly: false, prepMins: 25, priceFactor: 1.0, items: ['thali', 'paneerbutter', 'butterchicken', 'vegbiryani', 'chickenbiryani', 'lassi', 'gulabjamun', 'water'] },

  { id: 'r9', station: 'AGC', name: 'Agra Petha & Meals', cuisine: 'Thali, Sweets', rating: 4.3, ratingCount: 2040, vegOnly: true, prepMins: 20, priceFactor: 1.05, items: ['thali', 'minithali', 'chholebhature', 'rajma', 'samosa', 'chai', 'lassi', 'gulabjamun'] },
  { id: 'r10', station: 'AGC', name: 'Taj Biryani Corner', cuisine: 'Biryani, Mughlai', rating: 4.1, ratingCount: 1330, vegOnly: false, prepMins: 25, priceFactor: 1.1, items: ['chickenbiryani', 'eggbiryani', 'vegbiryani', 'butterchicken', 'chai', 'water'] },

  { id: 'r11', station: 'ET', name: 'Itarsi Bhojan Sagar', cuisine: 'North Indian, Thali', rating: 4.0, ratingCount: 520, vegOnly: true, prepMins: 20, priceFactor: 0.95, items: ['thali', 'minithali', 'dalrice', 'poha', 'samosa', 'chai', 'water'] },
  { id: 'r12', station: 'BSL', name: 'Bhusaval Kitchen', cuisine: 'Maharashtrian, North Indian', rating: 4.2, ratingCount: 870, vegOnly: false, prepMins: 20, priceFactor: 1.0, items: ['thali', 'dalrice', 'vegbiryani', 'chickenbiryani', 'vegburger', 'chai', 'lassi'] },
  { id: 'r13', station: 'NK', name: 'Nashik Misal House', cuisine: 'Maharashtrian, Snacks', rating: 4.4, ratingCount: 1500, vegOnly: true, prepMins: 15, priceFactor: 1.0, items: ['minithali', 'poha', 'samosa', 'sandwich', 'chai', 'coffee', 'lassi', 'water'] },
];

export function restaurantsAt(stationCode) {
  return RESTAURANTS.filter((r) => r.station === stationCode);
}

export function menuFor(restaurant) {
  return restaurant.items.map((id) => {
    const base = CATALOG[id];
    return { ...base, price: Math.round((base.price * restaurant.priceFactor) / 5) * 5 };
  });
}

// ---------- Billing ----------
export const DELIVERY_FEE = 30; // station handover charge
export const GST_RATE = 0.05;

export function calcBill(cartItems) {
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = cartItems.length ? DELIVERY_FEE : 0;
  const gst = Math.round(subtotal * GST_RATE);
  return { subtotal, delivery, gst, total: subtotal + delivery + gst };
}