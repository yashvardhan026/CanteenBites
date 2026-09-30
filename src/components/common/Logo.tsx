import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  inverted = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* CanteenBites Mark */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 shadow-md shadow-brand-500/25 text-white flex-shrink-0`}
      >
        {/* Stylized Fork & Bite Smile */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5"
        >
          {/* Burger bun top with bite cutout */}
          <path d="M4 11a8 8 0 0 1 14.5-4.5" />
          <circle cx="19" cy="6.5" r="1.5" fill="currentColor" />
          {/* Patty & steam */}
          <path d="M3 13h18" />
          {/* Bun bottom / bowl smile */}
          <path d="M5 16c2 3 12 3 14 0" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-tight ${textSizes[size]}`}>
          <span className={inverted ? 'text-white' : 'text-slate-900'}>Canteen</span>
          <span className="text-brand-600">Bites</span>
        </div>
        {showTagline && (
          <span
            className={`font-semibold tracking-wider uppercase mt-0.5 ${taglineSizes[size]} ${
              inverted ? 'text-indigo-200' : 'text-slate-500'
            }`}
          >
            Order. Track. Enjoy.
          </span>
        )}
      </div>
    </div>
  );
};
