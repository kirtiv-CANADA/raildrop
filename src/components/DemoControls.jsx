import { useState } from 'react';

// Demo-only panel. In a real product the delay would come from a live train status feed.
// Here, these buttons stand in for that feed so you can watch the app react.
// "Jump to a scene" opens a ready-made state, so key screens are easy to show.
export default function DemoControls({
  hasJourney,
  defaultOpen,
  delayMins,
  originalDelay,
  scenes,
  onSimulate,
  onReset,
  onScene,
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 right-3 z-50 bg-gray-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg"
      >
        Demo controls
      </button>
    );
  }

  return (
    <div className="fixed top-3 right-3 z-50 w-56 max-h-[88vh] overflow-y-auto bg-gray-900 text-white rounded-xl shadow-lg p-3">
      <div className="flex justify-between items-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">Demo controls</p>
        <button onClick={() => setOpen(false)} className="text-gray-400 text-xs hover:text-white" aria-label="Hide demo controls">
          Hide
        </button>
      </div>
      <p className="text-[11px] text-gray-300 mt-1 leading-snug">
        Stands in for the live train feed. Use it to see the app react to a delay.
      </p>

      {hasJourney && (
        <>
          <button
            onClick={onSimulate}
            className="w-full mt-2 bg-[#FC8019] text-white text-xs font-semibold py-2 rounded-lg hover:bg-orange-600"
          >
            Train gets 40 min later
          </button>
          <button
            onClick={onReset}
            className="w-full mt-2 bg-white text-gray-700 text-[11px] font-medium py-1.5 rounded-lg hover:bg-gray-100"
          >
            Back to original delay ({originalDelay} min)
          </button>
          <p className="text-[10px] text-gray-400 mt-2">Delay now: {delayMins} min</p>
        </>
      )}

      <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-3">Jump to a scene</p>
      <div className="mt-1 space-y-1">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onScene(scene.id)}
            className="w-full text-left bg-gray-800 text-gray-100 text-[11px] px-2 py-1.5 rounded-lg hover:bg-gray-700"
          >
            {scene.label}
          </button>
        ))}
      </div>
    </div>
  );
}