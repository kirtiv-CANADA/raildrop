export default function VegDot({ veg }) {
  const border = veg ? 'border-green-600' : 'border-red-600';
  const dot = veg ? 'bg-green-600' : 'bg-red-600';
  return (
    <div className={`w-4 h-4 border-2 flex items-center justify-center ${border}`}>
      <div className={`w-2 h-2 rounded-full ${dot}`} />
    </div>
  );
}