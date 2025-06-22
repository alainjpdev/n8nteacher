'use client';

const filters = [
  'Daily price',
  'Vehicle type',
  'Make & model',
  'Years',
  'Seats',
  'Electric',
  'Deliver to me',
  'All filters',
];

export default function FilterBar(): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2 border-b px-4 py-3 bg-white mt-[64px] z-10">
      {filters.map((filter, index) => (
        <button
          key={index}
          className="border rounded-full px-4 py-2 text-sm hover:bg-gray-100 transition"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}