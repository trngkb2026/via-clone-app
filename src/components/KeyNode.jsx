import { getDisplayLabel } from '../data/keymaps';

export default function KeyNode({ k, isSel, mappedCode, onKeyClick }) {
  const label = getDisplayLabel(mappedCode);
  return (
    <g onClick={(e) => { e.stopPropagation(); onKeyClick(k.id); }} className="cursor-pointer group">
      <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={6}
        className={`transition-all duration-150 ${isSel ? 'fill-[#2a2a2a] stroke-[#00d8ff] stroke-[3px]' : 'fill-[#222224] stroke-[#111] stroke-[2px] group-hover:stroke-[#555]'}`}
        style={isSel ? { filter: 'drop-shadow(0 0 6px rgba(0,216,255,0.6))' } : {}}
      />
      <text x={k.x + 6} y={k.y + 14} fontSize="9" fill={isSel ? "#00d8ff" : "#555"} textAnchor="start" className="pointer-events-none transition-colors">{k.orig}</text>
      <text x={k.x + k.w / 2} y={k.y + k.h / 2 + 5} fontSize={label.length > 3 ? "12" : "15"} fontWeight="bold" fill={isSel ? "#00d8ff" : "#e5e5e5"} textAnchor="middle" className="pointer-events-none transition-colors">{label}</text>
    </g>
  );
}
