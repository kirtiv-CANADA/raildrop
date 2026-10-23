// RailDrop sample data. All trains, PNRs, restaurants and prices are made up for the prototype.

// ---------- Helpers ----------
export function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = (((h * 60 + m + mins) % 1440) + 1440) % 1440;
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

// ---------- Trains (sample timetables) ----------
export const TRAINS = {
  '11058': {
    number: '11058',
    name: 'Amritsar - Mumbai Express (sample)',
    stops: [
      { code: 'NDLS', name: 'New Delhi', arrival: '20:25', haltMins: 5 },
      { code: 'NZM', name: 'Hazrat Nizamuddin', arrival: '20:51', haltMins: 2 },
      { code: 'MTJ', name: 'Mathura Jn', arrival: '22:50', haltMins: 1 },
      { code: 'AGC', name: 'Agra Cantt', arrival: '23:45', haltMins: 5 },
      { code: 'GWL', name: 'Gwalior Jn', arrival: '01:15', haltMins: 3 },
      { code: 'BPL', name: 'Bhopal Jn', arrival: '05:40', haltMins: 10 },
      { code: 'BHS', name: 'Vidisha', arrival: '08:20', haltMins: 2 },
    ],
  },
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

// ---------- Demo bookings ----------
// currentDelayMins = how late the train is when the passenger opens the app.
// nowTime = the demo clock (what time it is for the passenger).
// Keep the main demo first: the list on the Home screen follows this order.
export const PNRS = {
  '7305148296': {
    pnr: '7305148296',
    trainNumber: '11058',
    passenger: 'Kirti Sharma',
    phone: '9876543210',
    coach: 'S2',
    seat: 41,
    berth: 'Lower',
    boardingCode: 'NDLS',
    destinationCode: 'BHS',
    currentDelayMins: 63,
    nowTime: '20:00',
    title: 'Main demo',
    note: 'Waiting at New Delhi, train 1 hr 3 min late',
  },
  '4521879630': {
    pnr: '4521879630',
    trainNumber: '12961',
    passenger: 'Amit Kulkarni',
    phone: '9812345670',
    coach: 'B2',
    seat: 34,
    berth: 'Lower',
    boardingCode: 'INDB',
    destinationCode: 'NZM',
    currentDelayMins: 120,
    nowTime: '17:30',
    title: 'Long delay',
    note: 'Waiting at Indore, train 2 hr late',
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
    nowTime: '08:00',
    title: 'On time',
    note: 'Waiting at Bhopal, train on time',
  },
};

export function getJourneyByPnr(pnr) {
  const booking = PNRS[pnr];
  if (!booking) return null;
  const train = TRAINS[booking.trainNumber];
  const startIdx = train.stops.findIndex((s) => s.code === booking.boardingCode);
  const endIdx = train.stops.findIndex((s) => s.code === booking.destinationCode);
  // The boarding station is included because the train has not reached it yet.
  const deliverableStops = train.stops
    .slice(startIdx, endIdx + 1)
    .filter((s) => s.haltMins > 0 || s.code === booking.boardingCode);
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
  aloopratha: { id: 'aloopratha', name: 'Aloo Paratha (2 pcs)', category: 'Meals', veg: true, price: 90, desc: 'With curd and pickle' },
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

// ---------- Restaurants by station (all names are made up) ----------
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

  { id: 'r14', station: 'INDB', name: 'Chaat Bazaar Corner', cuisine: 'Snacks, Chaat', rating: 4.2, ratingCount: 930, vegOnly: true, prepMins: 15, priceFactor: 0.95, items: ['samosa', 'kachori', 'poha', 'sandwich', 'chai', 'coffee', 'water'] },
  { id: 'r15', station: 'INDB', name: 'Indore Express Meals', cuisine: 'North Indian, Thali', rating: 4.1, ratingCount: 1100, vegOnly: false, prepMins: 25, priceFactor: 1.0, items: ['thali', 'dalrice', 'paneerbutter', 'butterchicken', 'vegbiryani', 'chai', 'lassi', 'water'] },

  { id: 'r16', station: 'NDLS', name: 'Dilli Rasoi Kitchen', cuisine: 'North Indian, Punjabi', rating: 4.5, ratingCount: 2210, vegOnly: false, prepMins: 20, priceFactor: 1.1, items: ['thali', 'dalrice', 'rajma', 'chholebhature', 'paneerbutter', 'butterchicken', 'chickenbiryani', 'chai', 'lassi', 'water'] },
  { id: 'r17', station: 'NDLS', name: 'Paratha Gali House', cuisine: 'Parathas, Snacks', rating: 4.3, ratingCount: 1640, vegOnly: true, prepMins: 15, priceFactor: 1.05, items: ['aloopratha', 'chholebhature', 'rajma', 'samosa', 'kachori', 'chai', 'coffee', 'lassi', 'water'] },
  { id: 'r18', station: 'NDLS', name: 'Platform Grill Express', cuisine: 'Burgers, Wraps', rating: 4.0, ratingCount: 720, vegOnly: false, prepMins: 15, priceFactor: 1.1, items: ['chickenburger', 'vegburger', 'paneerwrap', 'sandwich', 'chai', 'coffee', 'water'] },

  { id: 'r19', station: 'NZM', name: 'Nizamuddin Biryani Point', cuisine: 'Biryani, Mughlai', rating: 4.2, ratingCount: 1390, vegOnly: false, prepMins: 25, priceFactor: 1.05, items: ['chickenbiryani', 'eggbiryani', 'vegbiryani', 'butterchicken', 'chai', 'water'] },

  { id: 'r20', station: 'MTJ', name: 'Mathura Peda & Meals', cuisine: 'Thali, Sweets', rating: 4.3, ratingCount: 1560, vegOnly: true, prepMins: 20, priceFactor: 1.0, items: ['thali', 'minithali', 'rajma', 'samosa', 'kachori', 'chai', 'lassi', 'gulabjamun', 'water'] },
  { id: 'r21', station: 'MTJ', name: 'Braj Rasoi 24x7', cuisine: 'North Indian, Snacks', rating: 4.0, ratingCount: 680, vegOnly: true, prepMins: 15, priceFactor: 0.95, items: ['minithali', 'dalrice', 'samosa', 'kachori', 'sandwich', 'chai', 'coffee', 'water'] },

  { id: 'r22', station: 'BHS', name: 'Vidisha Station Kitchen', cuisine: 'North Indian, Snacks', rating: 4.1, ratingCount: 340, vegOnly: true, prepMins: 20, priceFactor: 0.95, items: ['thali', 'dalrice', 'poha', 'samosa', 'chai', 'water'] },
];

// Opening hours [open, close]. A close time earlier than the open time means it closes after midnight.
export const RESTAURANT_HOURS = {
  r1: ['06:00', '22:30'], r2: ['07:00', '23:00'], r3: ['11:00', '01:00'],
  r4: ['08:00', '22:00'], r5: ['07:00', '23:30'], r6: ['00:00', '23:59'],
  r7: ['06:00', '21:00'], r8: ['09:00', '02:00'], r9: ['07:00', '23:00'],
  r10: ['11:00', '03:00'], r11: ['06:00', '22:00'], r12: ['07:00', '23:00'],
  r13: ['06:00', '22:00'], r14: ['10:00', '19:30'], r15: ['09:00', '23:00'],
  r16: ['09:00', '22:30'], r17: ['06:00', '23:30'], r18: ['08:00', '22:00'],
  r19: ['11:00', '01:00'], r20: ['06:00', '23:00'], r21: ['00:00', '23:59'],
  r22: ['06:00', '22:00'],
};

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
