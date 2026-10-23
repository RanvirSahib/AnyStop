import React from 'react';
import { Clock, Zap, Shield } from 'lucide-react';
import { TimeFilter, TypeFilter, OwnerFilter } from '../types/transit';

interface FilterBarProps {
  timeFilter: TimeFilter;
  typeFilter: TypeFilter;
  ownerFilter: OwnerFilter;
  onChangeTimeFilter: (filter: TimeFilter) => void;
  onChangeTypeFilter: (filter: TypeFilter) => void;
  onChangeOwnerFilter: (filter: OwnerFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  timeFilter,
  typeFilter,
  ownerFilter,
  onChangeTimeFilter,
  onChangeTypeFilter,
  onChangeOwnerFilter
}) => {
  const timeOptions: { key: TimeFilter; label: string }[] = [
    { key: 'now', label: 'Leaving in 60m' },
    { key: 'all', label: 'All Day' },
    { key: 'am', label: 'Morning (6-12)' },
    { key: 'pm', label: 'Afternoon (12-5)' },
    { key: 'ev', label: 'Evening (5-12)' }
  ];

  const typeOptions: { key: TypeFilter; label: string }[] = [
    { key: 'any', label: 'All Speeds' },
    { key: 'E', label: '⚡ Express' },
    { key: 'L', label: '🐢 All-Stop' }
  ];

  const ownerOptions: { key: OwnerFilter; label: string }[] = [
    { key: 'any', label: 'All Fleets' },
    { key: 'gov', label: '🏛️ Govt (PRTC/Punbus)' },
    { key: 'pvt', label: '⭐ Private (Orbit/Libra)' }
  ];

  return (
    <div className="space-y-3 pt-4">
      {/* Time Pills */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-1.5">
          <Clock className="w-3.5 h-3.5 text-[#FFB020]" />
          Departure Time
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {timeOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChangeTimeFilter(opt.key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                timeFilter === opt.key
                  ? 'bg-[#231F3D] dark:bg-[#F6F1FF] text-white dark:text-[#231F3D] border-transparent shadow-sm'
                  : 'bg-white dark:bg-[#211C40] text-[#231F3D] dark:text-[#DAD3F2] border-[#EBDDD0] dark:border-[#342E5A] hover:border-[#FF5A4E]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Speed & Fleet Pills */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Speed Type */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FF5A4E]" />
            Speed
          </div>
          <div className="flex items-center gap-1.5">
            {typeOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChangeTypeFilter(opt.key)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                  typeFilter === opt.key
                    ? 'bg-[#FF5A4E] text-white border-[#FF5A4E] shadow-sm'
                    : 'bg-white dark:bg-[#211C40] text-[#231F3D] dark:text-[#DAD3F2] border-[#EBDDD0] dark:border-[#342E5A] hover:border-[#FF5A4E]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Owner */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-1.5">
            <Shield className="w-3.5 h-3.5 text-[#0B8F82] dark:text-[#4DE0CF]" />
            Fleet
          </div>
          <div className="flex items-center gap-1.5">
            {ownerOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChangeOwnerFilter(opt.key)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                  ownerFilter === opt.key
                    ? 'bg-[#0B8F82] text-white border-[#0B8F82] shadow-sm'
                    : 'bg-white dark:bg-[#211C40] text-[#231F3D] dark:text-[#DAD3F2] border-[#EBDDD0] dark:border-[#342E5A] hover:border-[#0B8F82]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
