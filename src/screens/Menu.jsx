import { useState } from 'react';
import { menuFor, formatTime } from '../data';
import VegDot from '../components/VegDot';

export default function Menu({ restaurant, status, cart, onAddToCart, onBack }) {
  const menuItems = menuFor(restaurant);
  const [vegOnly, setVegOnly] = useState(false);
  const canOrder = status.status === 'open';

  const shownItems = !restaurant.vegOnly && vegOnly ? menuItems.filter((item) => item.veg) : menuItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6 pb-24">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Restaurants
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
          <p className="text-sm text-gray-500">
            {restaurant.cuisine} · {restaurant.prepMins} min prep
          </p>

          {restaurant.vegOnly ? (
            <span className="inline-block mt-3 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
              Pure Veg
            </span>
          ) : (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="vegOnly"
                checked={vegOnly}
                onChange={() => setVegOnly(!vegOnly)}
                className="w-4 h-4"
              />
              <label htmlFor="vegOnly" className="text-sm font-medium text-gray-700 cursor-pointer">
                Veg only
              </label>
            </div>
          )}
        </div>

        {canOrder ? (
          <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-3 mb-4 text-sm text-gray-700">
            Order by <strong>{formatTime(status.orderBy)}</strong> · Your train arrives at{' '}
            <strong>{formatTime(status.eta)}</strong>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-600">
            {status.reason} Go back to choose another restaurant or station.
          </div>
        )}

        <div className="space-y-4">
          {shownItems.map((item) => {
            const cartItem = cart.find((c) => c.id === item.id);
            const qty = cartItem ? cartItem.qty : 0;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm"
              >
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <VegDot veg={item.veg} />
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">₹{item.price}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>

                <div className="flex-shrink-0">
                  {qty === 0 ? (
                    <button
                      disabled={!canOrder}
                      onClick={() => onAddToCart(item, 'add')}
                      className={`px-6 py-1.5 border rounded-lg text-sm font-semibold transition-all ${
                        canOrder
                          ? 'border-gray-300 text-green-600 hover:border-green-500 hover:bg-green-50'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onAddToCart(item, 'remove')}
                        className="px-3 py-1.5 text-green-600 font-bold hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-bold text-gray-800">{qty}</span>
                      <button
                        onClick={() => onAddToCart(item, 'add')}
                        className="px-3 py-1.5 text-green-600 font-bold hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
