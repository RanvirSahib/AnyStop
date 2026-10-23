import React, { useState } from 'react';
import { ArrowUpDown, MapPin, Navigation, Sparkles } from 'lucide-react';

interface StopSelectorProps {
  from: string;
  to: string;
  stops: string[];
  popularTrips: [string, string][];
  onChangeFrom: (stop: string) => void;
  onChangeTo: (stop: string) => void;
  onSwap: () => void;
  onSelectTrip: (from: string, to: string) => void;
}

export const StopSelector: React.FC<StopSelectorProps> = ({
  from,
  to,
  stops,
  popularTrips,
  onChangeFrom,
  onChangeTo,
  onSwap,
  onSelectTrip
}) => {
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    onSwap();
    setTimeout(() => setIsSwapping(false), 300);
  };

  const isInvalid = from && to && from === to;

  return (
    <div className="bg-white dark:bg-[#211C40] rounded-2xl p-4 sm:p-6 shadow-xl shadow-[#1F1A3F]/10 dark:shadow-black/30 border border-[#EBDDD0] dark:border-[#342E5A] -mt-12 relative z-10">
      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-end">
        {/* Origin */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF5A4E]" />
            Boarding Stop (From)
          </label>
          <div className="relative">
            <input
              type="text"
              list="from-stops-list"
              value={from}
              onChange={(e) => onChangeFrom(e.target.value)}
              placeholder="e.g. CU Gate 2 (Gharuan)"
              className="w-full h-12 pl-3 pr-8 rounded-xl border-2 border-[#EBDDD0] dark:border-[#342E5A] bg-[#FFF5EC] dark:bg-[#15122B] text-[#231F3D] dark:text-[#F6F1FF] font-medium text-sm sm:text-base focus:outline-none focus:border-[#FF5A4E] focus:ring-4 focus:ring-[#FF5A4E]/15 transition-all"
            />
            <datalist id="from-stops-list">
              {stops.map((stop) => (
                <option key={stop} value={stop} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center sm:pb-1">
          <button
            onClick={handleSwap}
            type="button"
            className={`w-11 h-11 rounded-full bg-[#FF5A4E] hover:bg-[#E8433A] text-white flex items-center justify-center shadow-md shadow-[#FF5A4E]/30 transition-transform duration-300 active:scale-90 ${
              isSwapping ? 'rotate-180' : ''
            }`}
            title="Swap Origin and Destination"
            aria-label="Swap Stops"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-1.5 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#0B8F82] dark:text-[#4DE0CF]" />
            Destination (To)
          </label>
          <div className="relative">
            <input
              type="text"
              list="to-stops-list"
              value={to}
              onChange={(e) => onChangeTo(e.target.value)}
              placeholder="e.g. Ludhiana Bus Stand"
              className="w-full h-12 pl-3 pr-8 rounded-xl border-2 border-[#EBDDD0] dark:border-[#342E5A] bg-[#FFF5EC] dark:bg-[#15122B] text-[#231F3D] dark:text-[#F6F1FF] font-medium text-sm sm:text-base focus:outline-none focus:border-[#FF5A4E] focus:ring-4 focus:ring-[#FF5A4E]/15 transition-all"
            />
            <datalist id="to-stops-list">
              {stops.map((stop) => (
                <option key={stop} value={stop} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {/* Validation warning */}
      {isInvalid && (
        <p className="mt-3 text-xs sm:text-sm font-semibold text-[#E8433A] dark:text-[#FF5A4E]">
          Please choose two different stops to view bus departures.
        </p>
      )}

      {/* Popular Trips */}
      <div className="mt-4 pt-3 border-t border-[#EBDDD0]/60 dark:border-[#342E5A]/60">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
          Popular Routes
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {popularTrips.map(([tripFrom, tripTo], idx) => {
            const isSelected = from === tripFrom && to === tripTo;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectTrip(tripFrom, tripTo)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#231F3D] dark:bg-[#F6F1FF] text-white dark:text-[#231F3D] border-transparent shadow-sm'
                    : 'bg-white dark:bg-[#15122B] text-[#231F3D] dark:text-[#DAD3F2] border-[#EBDDD0] dark:border-[#342E5A] hover:border-[#FF5A4E]'
                }`}
              >
                {tripFrom.replace(" (Gharuan)", "").replace(" Bus Stand", "")} → {tripTo.replace(" (Gharuan)", "").replace(" Bus Stand", "")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
