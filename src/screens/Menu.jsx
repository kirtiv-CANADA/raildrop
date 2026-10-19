import { useState } from 'react';
import { menuFor } from '../data';

export default function Menu({ restaurant, onBack, onAddToCart, cart }) {
  const menuItems = menuFor(restaurant);
  const [vegOnly, setVegOnly] = useState(false);

  const filteredItems = vegOnly ? menuItems.filter(item => item.veg) : menuItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6 pb-24">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Restaurants
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
          <p className="text-sm text-gray-500">{restaurant.cuisine} • {restaurant.prepMins} mins prep</p>
          
          <div className="mt-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="vegOnly" 
              checked={vegOnly} 
              onChange={() => setVegOnly(!vegOnly)}
              className="w-4 h-4 text-[#FC8019] border-gray-300 rounded focus:ring-[#FC8019]"
            />
            <label htmlFor="vegOnly" className="text-sm font-medium text-gray-700 cursor-pointer">
              Veg Only
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            const qty = cartItem ? cartItem.qty : 0;

            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 border flex items-center justify-center ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">₹{item.price}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                </div>
                
                <div className="flex-shrink-0">
                  {qty === 0 ? (
                    <button 
                      onClick={() => onAddToCart(item, 'add')}
                      className="px-6 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-green-600 hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button onClick={() => onAddToCart(item, 'remove')} className="px-3 py-1.5 text-green-600 font-bold hover:bg-gray-50">-</button>
                      <span className="px-2 text-sm font-bold text-gray-800">{qty}</span>
                      <button onClick={() => onAddToCart(item, 'add')} className="px-3 py-1.5 text-green-600 font-bold hover:bg-gray-50">+</button>
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