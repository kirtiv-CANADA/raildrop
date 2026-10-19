import { restaurantsAt, menuFor } from '../data';

export default function Restaurants({ station, onSelectRestaurant, onBack }) {
  const restaurants = restaurantsAt(station.code);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Stations
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurants at {station.name}</h2>
        <p className="text-sm text-gray-600 mb-6">Food will be handed over at your seat.</p>

        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    ★ {restaurant.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{restaurant.cuisine} • {restaurant.prepMins} mins prep</p>
                
                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="w-full bg-white border border-[#FC8019] text-[#FC8019] font-semibold py-2 rounded-lg hover:bg-orange-50 transition-all"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
          {restaurants.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No restaurants available at this station right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}