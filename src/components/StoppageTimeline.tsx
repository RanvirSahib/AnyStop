import React from 'react';
import { formatMinutesToTime } from '../utils/transitEngine';

interface StoppageTimelineProps {
  stops: [string, number][];
  startMinutes: number;
  userFromIndex: number;
  userToIndex: number;
}

export const StoppageTimeline: React.FC<StoppageTimelineProps> = ({
  stops,
  startMinutes,
  userFromIndex,
  userToIndex
}) => {
  return (
    <div className="py-3 px-2 border-t border-[#EBDDD0] dark:border-[#342E5A] bg-[#FFF5EC]/40 dark:bg-[#15122B]/40 rounded-b-xl">
      <div className="text-xs font-bold uppercase tracking-wider text-[#6B6585] dark:text-[#A9A2C8] mb-3 px-2">
        Full Route Stoppage Progression
      </div>
      <ol className="relative border-l-2 border-[#EBDDD0] dark:border-[#342E5A] ml-4 space-y-4">
        {stops.map(([stopName, offsetMins], index) => {
          const isUserBoarding = index === userFromIndex;
          const isUserDestination = index === userToIndex;
          const isBetweenUserTrip = index > userFromIndex && index < userToIndex;
          const stopTime = formatMinutesToTime(startMinutes + offsetMins);

          let pointBg = 'bg-[#EBDDD0] dark:bg-[#342E5A]';
          let textColor = 'text-[#6B6585] dark:text-[#A9A2C8]';

          if (isUserBoarding) {
            pointBg = 'bg-[#0B8F82] dark:bg-[#4DE0CF] ring-4 ring-[#0B8F82]/20';
            textColor = 'text-[#0B8F82] dark:text-[#4DE0CF] font-bold';
          } else if (isUserDestination) {
            pointBg = 'bg-[#FF5A4E] ring-4 ring-[#FF5A4E]/20';
            textColor = 'text-[#FF5A4E] font-bold';
          } else if (isBetweenUserTrip) {
            pointBg = 'bg-[#FFB020]';
            textColor = 'text-[#231F3D] dark:text-[#F6F1FF] font-medium';
          }

          return (
            <li key={index} className="ml-4 relative">
              <span
                className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full transition-all ${pointBg}`}
              />
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className={textColor}>
                  {stopName}
                  {isUserBoarding && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#0B8F82]/10 dark:bg-[#0B8F82]/30 text-[#0B8F82] dark:text-[#4DE0CF] font-bold">
                      Board Here
                    </span>
                  )}
                  {isUserDestination && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#FF5A4E]/10 text-[#FF5A4E] font-bold">
                      Get Off Here
                    </span>
                  )}
                </span>
                <span className="text-xs text-[#6B6585] dark:text-[#A9A2C8] font-mono">
                  {stopTime}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
