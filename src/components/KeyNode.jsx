import { getDisplayLabel, getMappingType } from '../data/keymaps';

const typeColors = {
  simple: { text: '#e5e5e5', sel: '#00d8ff' },
  combo: { text: '#00d8ff', sel: '#00ffff' },
  sequence: { text: '#ffb800', sel: '#ffdd44' },
  consumer: { text: '#00ff88', sel: '#66ffbb' },
  system: { text: '#b388ff', sel: '#d4b5ff' },
  apple_vendor: { text: '#b388ff', sel: '#d4b5ff' },
  apple_vendor_kb: { text: '#b388ff', sel: '#d4b5ff' },
};

export default function KeyNode({ k, isSel, mappedCode, onKeyClick, isModified }) {
  const disabled = k.disabled;
  const label = disabled ? k.orig : getDisplayLabel(mappedCode);
  const mtype = disabled ? 'simple' : getMappingType(mappedCode);
  const colors = typeColors[mtype] || typeColors.simple;
  const textColor = disabled ? '#444' : isSel ? colors.sel : colors.text;

  return (
    <g onClick={(e) => { e.stopPropagation(); if (!disabled) onKeyClick(k.id); }} className={disabled ? 'cursor-not-allowed' : 'cursor-pointer group'} opacity={disabled ? 0.4 : 1}>
      <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={6}
        className={`transition-all duration-150 ${disabled ? 'fill-[#1a1a1c] stroke-[#111] stroke-[1px]' : isSel ? 'fill-[#2a2a2a] stroke-[#00d8ff] stroke-[3px]' : 'fill-[#222224] stroke-[#111] stroke-[2px] group-hover:stroke-[#555]'}`}
        style={isSel && !disabled ? { filter: 'drop-shadow(0 0 6px rgba(0,216,255,0.6))' } : {}}
      />
      {/* Original key label (top-left) */}
      <text x={k.x + 6} y={k.y + 14} fontSize="9" fill={disabled ? '#333' : isSel ? "#00d8ff" : "#555"} textAnchor="start" className="pointer-events-none transition-colors">{k.orig}</text>
      {/* Mapped label (center) */}
      <text x={k.x + k.w / 2} y={k.y + k.h / 2 + 5} fontSize={label.length > 5 ? "10" : label.length > 3 ? "12" : "15"} fontWeight="bold" fill={textColor} textAnchor="middle" className="pointer-events-none transition-colors">{label}</text>
      {/* Modified indicator dot */}
      {isModified && !disabled && (
        <circle cx={k.x + k.w - 8} cy={k.y + 8} r={3} fill={colors.text} opacity={0.8} className="pointer-events-none" />
      )}
      {/* Type indicator bar (bottom) */}
      {mtype !== 'simple' && !disabled && (
        <rect x={k.x + 8} y={k.y + k.h - 6} width={k.w - 16} height={2} rx={1} fill={colors.text} opacity={0.4} className="pointer-events-none" />
      )}
    </g>
  );
}
