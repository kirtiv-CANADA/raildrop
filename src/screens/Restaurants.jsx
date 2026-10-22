import { restaurantsAt, formatTime } from '../data';
import { getEta, getRestaurantStatus } from '../utils/rules';

const formatMins = (m) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h} hr ${r} min` : `${r} min`;
};

export default function Restaurants({ station, journey, delayMins, onSelectRestaurant, onBack }) {
  const { booking } = journey;
  const eta = getEta(station, delayMins);

  const rows = restaurantsAt(station.code)
    .map((restaurant) => ({
      restaurant,
      info: getRestaurantStatus(restaurant, station, delayMins, booking.nowTime),
    }))
    .sort((a, b) => (a.info.status === 'open' ? 0 : 1) - (b.info.status === 'open' ? 0 : 1));

  const openCount = rows.filter((r) => r.info.status === 'open').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Stations
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Restaurants at {station.name}</h2>
        <p className="text-sm text-gray-600 mb-1">
          Your train arrives at <strong>{formatTime(eta)}</strong>
          {delayMins > 0 && <span className="text-red-500"> (late)</span>}. Food is handed over at your seat.
        </p>
        <p className="text-xs text-gray-500 mb-6">{openCount} of {rows.length} restaurants can deliver.</p>

        <div className="space-y-4">
          {rows.map(({ restaurant, info }) => {
            const open = info.status === 'open';
            return (
              <div
                key={restaurant.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all ${
                  open ? 'border-gray-200 shadow-sm hover:shadow-md' : 'border-gray-200 opacity-70'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                      ★ {restaurant.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {restaurant.cuisine} · {restaurant.prepMins} min prep
                    {restaurant.vegOnly && <span className="text-green-600 font-semibold"> · Pure Veg</span>}
                  </p>

                  {open ? (
                    <>
                      <p className="text-sm text-gray-700 mt-3">
                        Order by <strong>{formatTime(info.orderBy)}</strong>{' '}
                        <span className="text-gray-500">({formatMins(info.minsLeft)} left)</span>
                      </p>
                      <button
                        onClick={() => onSelectRestaurant(restaurant)}
                        className="w-full mt-3 bg-white border border-[#FC8019] text-[#FC8019] font-semibold py-2 rounded-lg hover:bg-orange-50 transition-all"
                      >
                        View Menu
                      </button>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{info.reason}</p>
                  )}
                </div>
              </div>
            );
          })}

          {openCount === 0 && (
            <p className="text-center text-sm text-gray-600 mt-6">
              Nothing can deliver here at your arrival time. Go back and pick another station.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}