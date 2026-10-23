import { formatTime } from '../data';

export default function RestaurantPanel({ order, eta, cookStart, placedCookStart, delta, atRisk }) {
  const { restaurant, items } = order;

  return (
    <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 mt-4">
      <p className="text-[10px] uppercase tracking-wider text-gray-400">Restaurant app (simulated)</p>
      <p className="font-bold mt-1">{restaurant.name}</p>
      <p className="text-xs text-gray-400">
        Order {order.id} · Train arrival {formatTime(eta)}
      </p>

      <ul className="mt-3 text-sm space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            {item.qty} × {item.name}
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-gray-700 pt-3 text-sm">
        {atRisk ? (
          <p className="text-red-400 font-semibold">
            Order cancelled: the train now arrives after closing time. Do not cook.
          </p>
        ) : (
          <>
            <p>
              Start cooking at <strong className="text-orange-400">{formatTime(cookStart)}</strong>
            </p>
            {delta !== 0 && (
              <p className="text-xs text-yellow-300 mt-1">
                Updated: it was {formatTime(placedCookStart)}. The train arrival time changed.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
