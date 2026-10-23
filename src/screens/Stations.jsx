import { formatTime, formatDelay, restaurantsAt } from '../data';
import { getEta, getRestaurantStatus } from '../utils/rules';

export default function Stations({ journey, delayMins, onSelectStation, onBack }) {
  const { deliverableStops, booking } = journey;

  const rows = deliverableStops.map((stop) => {
    const all = restaurantsAt(stop.code);
    const openCount = all.filter(
      (r) => getRestaurantStatus(r, stop, delayMins, booking.nowTime).status === 'open'
    ).length;
    return { stop, total: all.length, openCount, eta: getEta(stop, delayMins) };
  });

  const firstUsable = rows.find((r) => r.openCount > 0);
  const firstRowBlocked = rows.length > 0 && rows[0].openCount === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Journey
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a delivery station</h2>
        <p className="text-sm text-gray-600 mb-4">
          Your train is {delayMins > 0 ? formatDelay(delayMins) : 'on time'}. Times below use the live arrival estimate.
        </p>

        {firstRowBlocked && firstUsable && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-[#FC8019]">Nothing available at your first station</p>
            <p className="text-sm text-gray-700 mt-1">
              The earliest station with food you can still order from is{' '}
              <strong>{firstUsable.stop.name}</strong> at {formatTime(firstUsable.eta)}.
            </p>
          </div>
        )}

        {!firstUsable && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-red-600">No station can deliver right now</p>
            <p className="text-sm text-gray-700 mt-1">
              With the current arrival times, every restaurant on your route is closed or past its order cutoff.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {rows.map(({ stop, total, openCount, eta }) => {
            const usable = openCount > 0;
            const isBoarding = stop.code === booking.boardingCode;

            return (
              <div
                key={stop.code}
                onClick={() => usable && onSelectStation(stop)}
                className={`border rounded-xl p-5 transition-all ${
                  usable
                    ? 'bg-white border-gray-200 cursor-pointer hover:border-[#FC8019] hover:shadow-md'
                    : 'bg-gray-100 border-gray-200 opacity-80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {stop.name} ({stop.code})
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isBoarding ? 'Your boarding station · train not here yet' : `Halt time: ${stop.haltMins} mins`}
                    </p>
                  </div>
                  <div className="text-right">
                    {delayMins > 0 && (
                      <p className="text-xs text-gray-400 line-through">{formatTime(stop.arrival)}</p>
                    )}
                    <p className={`text-sm font-bold ${delayMins > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {formatTime(eta)}
                    </p>
                  </div>
                </div>

                {usable ? (
                  <span className="inline-block mt-3 text-xs font-semibold text-[#FC8019] bg-orange-50 px-3 py-1 rounded-full">
                    {openCount} of {total} {total === 1 ? 'restaurant' : 'restaurants'} can deliver · View
                  </span>
                ) : (
                  <p className="mt-3 text-sm text-gray-600">
                    {total === 0
                      ? 'No restaurants serve this station.'
                      : `All ${total} ${total === 1 ? 'restaurant is' : 'restaurants are'} closed or past the order cutoff at ${formatTime(eta)}.`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
