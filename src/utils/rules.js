import { addMinutes, formatTime, restaurantsAt, RESTAURANT_HOURS } from '../data';

// ASSUMPTION for this prototype (not any real company's rule):
// order-by time = train ETA - cooking time - 30 minute buffer
export const ORDER_BUFFER_MINS = 30;

// An order-by time up to 2 hours before "now" counts as already passed.
const PAST_WINDOW_MINS = 120;

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Minutes going forward in time from one clock time to another (0 to 1439).
const forwardDiff = (from, to) => (toMin(to) - toMin(from) + 1440) % 1440;

export function getEta(stop, delayMins) {
  return addMinutes(stop.arrival, delayMins);
}

export function getOrderBy(eta, restaurant) {
  return addMinutes(eta, -(restaurant.prepMins + ORDER_BUFFER_MINS));
}

// Cooking should start this long before the train arrives: cooking time + 10 min packing.
export function getCookStart(eta, restaurant) {
  return addMinutes(eta, -(restaurant.prepMins + 10));
}

export function isOpenAt(restaurant, hhmm) {
  const [open, close] = RESTAURANT_HOURS[restaurant.id] || ['00:00', '23:59'];
  const t = toMin(hhmm);
  const o = toMin(open);
  const c = toMin(close);
  return o <= c ? t >= o && t <= c : t >= o || t <= c;
}

// status: 'open' | 'closed' | 'cutoff_passed'
export function getRestaurantStatus(restaurant, stop, delayMins, nowHHMM) {
  const eta = getEta(stop, delayMins);
  const orderBy = getOrderBy(eta, restaurant);
  const [, close] = RESTAURANT_HOURS[restaurant.id] || ['00:00', '23:59'];

  if (!isOpenAt(restaurant, eta)) {
    return {
      status: 'closed',
      eta,
      orderBy,
      reason: `Closes at ${formatTime(close)}, before your train arrives at ${formatTime(eta)}.`,
    };
  }

  const minsLeft = forwardDiff(nowHHMM, orderBy);
  if (minsLeft > 1440 - PAST_WINDOW_MINS) {
    return {
      status: 'cutoff_passed',
      eta,
      orderBy,
      reason: `Order window closed at ${formatTime(orderBy)}.`,
    };
  }

  return { status: 'open', eta, orderBy, minsLeft };
}

// "Can I order right now?" Finds the first station on the route where at least one restaurant can deliver.
export function getOrderingSummary(journey, delayMins) {
  const { booking, deliverableStops } = journey;
  for (const stop of deliverableStops) {
    const all = restaurantsAt(stop.code);
    const open = all
      .map((r) => ({ r, info: getRestaurantStatus(r, stop, delayMins, booking.nowTime) }))
      .filter((x) => x.info.status === 'open');
    if (open.length > 0) {
      const tightest = open.reduce((a, b) => (b.info.minsLeft < a.info.minsLeft ? b : a));
      // What would a cutoff based on the printed timetable (no delay) say for the same restaurant?
      const byTimetable = getRestaurantStatus(tightest.r, stop, 0, booking.nowTime);
      return {
        restaurantName: tightest.r.name,
        timetableClosed: byTimetable.status !== 'open',
        timetableOrderBy: byTimetable.orderBy,
        timetableEta: getEta(stop, 0),
        station: stop,
        isBoarding: stop.code === booking.boardingCode,
        openCount: open.length,
        total: all.length,
        eta: getEta(stop, delayMins),
        orderBy: tightest.info.orderBy,
        minsLeft: tightest.info.minsLeft,
      };
    }
  }
  return null;
}