export default function DemoControls({ delayMins, onSimulate, onReset }) {
  return (
    <div className="fixed top-3 right-3 z-50 flex flex-col items-end gap-2">
      <button
        onClick={onSimulate}
        className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
      >
        Demo: add 40 min delay
      </button>
      <button
        onClick={onReset}
        className="bg-white text-gray-600 border border-gray-300 text-[11px] font-medium px-3 py-1 rounded-full shadow hover:bg-gray-50"
      >
        Reset delay ({delayMins} min)
      </button>
    </div>
  );
}