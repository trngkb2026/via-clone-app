import KeyNode from './KeyNode';
import { ewinKeys } from '../data/keymaps';

export default function EwinSVG({ keymap, selectedKey, onKeyClick }) {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-full max-h-[55vh] drop-shadow-2xl" onClick={() => onKeyClick(null)}>
      <defs>
        <linearGradient id="rgb-glow" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="750" y2="0">
          <stop offset="0%" stopColor="#ff1493" />
          <stop offset="35%" stopColor="#00ffff" />
          <stop offset="70%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#ccff00" />
        </linearGradient>
        <linearGradient id="pad-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38383a" />
          <stop offset="100%" stopColor="#2c2c2e" />
        </linearGradient>
      </defs>
      <rect x="20" y="30" width="760" height="490" rx="140" ry="140" fill="#1c1c1e" stroke="#0a0a0a" strokeWidth="4" />
      <rect x="30" y="40" width="740" height="470" rx="130" ry="130" fill="#2c2c2e" stroke="#333" strokeWidth="2" />
      <g transform="translate(250, 60)">
        <rect x="0" y="0" width="300" height="170" fill="url(#pad-grad)" stroke="#111" strokeWidth="2" rx="8" />
        <text x="50" y="45" fill="#666" fontSize="26" letterSpacing="3" fontWeight="300" fontFamily="sans-serif">EWIN</text>
        <g stroke="#888" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M90 130 v-25 a4 4 0 0 1 8 0 v15 m-8 -5 h-6 a4 4 0 0 0 -4 4 v6" /><circle cx="94" cy="95" r="4" fill="#888" stroke="none" />
          <path d="M150 130 v-30 a4 4 0 0 1 8 0 v20 m-8 -15 h-6 a4 4 0 0 0 -4 4 v6" /><path d="M158 110 v-25 a4 4 0 0 1 8 0 v20" />
          <path d="M210 130 v-30 a4 4 0 0 1 8 0 v20 m-8 -15 h-6 a4 4 0 0 0 -4 4 v6" /><path d="M218 110 v-25 a4 4 0 0 1 8 0 v20" /><path d="M226 110 v-20 a4 4 0 0 1 8 0 v20" />
        </g>
      </g>
      <g transform="translate(160, 160)">
        <rect x="-60" y="-100" width="40" height="30" fill="#111" stroke="#b522ff" strokeWidth="2" rx="8" />
        <circle cx="0" cy="0" r="55" fill="#111" stroke="url(#rgb-glow)" strokeWidth="2" />
        <line x1="-38" y1="-38" x2="-15" y2="-15" stroke="#333" strokeWidth="2"/><line x1="38" y1="-38" x2="15" y2="-15" stroke="#333" strokeWidth="2"/>
        <line x1="-38" y1="38" x2="-15" y2="15" stroke="#333" strokeWidth="2"/><line x1="38" y1="38" x2="15" y2="15" stroke="#333" strokeWidth="2"/>
        <circle cx="0" cy="0" r="18" fill="#222" stroke="#555" strokeWidth="1.5" />
      </g>
      <g transform="translate(560, 60)">
        <rect x="10" y="0" width="40" height="30" fill="#111" stroke="#22d0ff" strokeWidth="2" rx="8" />
        <rect x="50" y="40" width="35" height="20" fill="#111" stroke="#22ff88" strokeWidth="2" rx="6" />
        <rect x="95" y="40" width="35" height="20" fill="#111" stroke="#22ff88" strokeWidth="2" rx="6" />
        <rect x="50" y="115" width="40" height="45" fill="#e61938" stroke="#900" strokeWidth="1" rx="8" />
      </g>
      {ewinKeys.map(k => <KeyNode key={k.id} k={k} isSel={selectedKey === k.id} mappedCode={keymap[k.id]} onKeyClick={onKeyClick} />)}
    </svg>
  );
}
