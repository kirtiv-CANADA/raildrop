import { useState } from 'react';
import { getJourneyByPnr, PNRS } from '../data';

export default function Home({ onFound, onCompare }) {
  const [pnr, setPnr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(pnr)) {
      setError('Enter a valid 10-digit PNR number.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const journey = getJourneyByPnr(pnr);
      setLoading(false);

      if (!journey) {
        setError("We couldn't find a booking for this PNR. Try one of the demo bookings below.");
        return;
      }
      onFound(journey);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-[#FC8019] text-center">RailDrop</h1>
        <p className="text-gray-600 text-center mt-2">
          Order food to your train seat, even when the train is late.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">PNR number</label>
          <input
            type="text"
            inputMode="numeric"
            value={pnr}
            onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            placeholder="Enter your 10-digit PNR"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FC8019]"
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-lg font-semibold text-white transition-all ${
              loading ? 'bg-gray-400' : 'bg-[#FC8019] hover:bg-orange-600'
            }`}
          >
            {loading ? 'Fetching train status...' : 'Find my train'}
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="text-sm font-medium text-[#FC8019] hover:underline"
          >
            {showDemo ? 'Hide demo bookings' : "Don't have a PNR? Try a demo booking"}
          </button>

          {showDemo && (
            <div className="space-y-2 mt-3">
              {Object.values(PNRS).map((b) => (
                <button
                  key={b.pnr}
                  type="button"
                  onClick={() => {
                    setPnr(b.pnr);
                    setError('');
                  }}
                  className="w-full text-left bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#FC8019] transition-all"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {b.title}: {b.pnr}
                  </p>
                  <p className="text-xs text-gray-500">
                    {b.passenger} · {b.note}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onCompare}
          className="block mx-auto mt-6 text-sm font-medium text-gray-600 underline hover:text-[#FC8019]"
        >
          How is this different from ordering today?
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          Concept prototype with sample data. Not affiliated with any railway or food delivery company.
        </p>
      </div>
    </div>
  );
}
