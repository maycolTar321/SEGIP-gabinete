import React from 'react';

interface BoliviaMapProps {
  className?: string;
}

export const BoliviaMap: React.FC<BoliviaMapProps> = ({ className = "w-28 h-28 opacity-25" }) => {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Silueta vectorial precisa del contorno del Estado Plurinacional de Bolivia */}
      <path
        d="M98 12C95 18 90 22 84 27C78 32 72 35 68 40C62 48 58 58 54 68C50 78 44 86 38 94C32 102 26 112 25 124C24 135 28 145 32 154C36 163 42 170 48 178C53 184 57 192 63 198C68 203 74 210 80 216C86 222 93 226 99 229C105 228 112 222 118 215C124 207 130 198 135 188C140 178 145 168 152 159C158 150 165 142 168 132C171 122 170 112 166 102C162 92 155 83 148 75C141 67 135 58 130 48C126 39 121 30 115 22C110 15 104 10 98 12Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 2"
      />
      <circle cx="85" cy="115" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="110" cy="140" r="2.5" fill="currentColor" opacity="0.6" />
      <circle cx="125" cy="120" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  );
};
