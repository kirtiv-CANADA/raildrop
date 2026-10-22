export default function BeforeAfter({ onBack }) {
  const today = [
    'A restaurant shows "Order by 9:08 PM", then the page says "No items available right now".',
    'A station says "No restaurants serving here" and offers only a "Next station" button.',
    '"No stations available. We do not have enough time left to deliver at any serviceable station."',
    'A station card promises many restaurants, but the list shows only one.',
  ];
  const withRailDrop = [
    'The order-by time is recalculated from the live arrival estimate.',
    'A closed restaurant says why, for example "Closes at 9:45 PM, before your train arrives at 10:08 PM".',
    'If the first station has nothing, the app points to the earliest station that works.',
    'The restaurant is told when to start cooking, and the time updates when the delay changes.',
    'If a delay pushes arrival past closing time, the passenger gets a clear message and a refund.',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Before and after</h2>
        <p className="text-sm text-gray-600 mb-5">
          RailDrop is a concept for a delayed train. Existing railway food apps already show the delay, but a late train
          can still end in a dead end.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <p className="font-bold text-gray-800 mb-1">Today</p>
          <p className="text-xs text-gray-500 mb-3">Messages seen while checking a delayed train at New Delhi.</p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
            {today.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white border-2 border-[#FC8019] rounded-2xl p-5">
          <p className="font-bold text-[#FC8019] mb-3">With RailDrop</p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
            {withRailDrop.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-400 mt-5">
          Built with sample data. The order-by rule (arrival time minus cooking time minus 30 minutes) is our own
          assumption, not a real company's rule.
        </p>
      </div>
    </div>
  );
}