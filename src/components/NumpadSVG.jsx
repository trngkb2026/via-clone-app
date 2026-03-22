import KeyNode from './KeyNode';
import { numpadKeys } from '../data/keymaps';

export default function NumpadSVG({ keymap, selectedKey, onKeyClick, defaults }) {
  return (
    <svg viewBox="0 0 670 560" className="w-full h-full max-h-[calc(100vh-80px)] drop-shadow-2xl" onClick={() => onKeyClick(null)}>
      <rect x="20" y="20" width="630" height="520" rx="24" fill="#2c2c2e" stroke="#1a1a1c" strokeWidth="4" />
      <circle cx="295" cy="99" r="2.5" fill="#555" />
      <circle cx="295" cy="119" r="2.5" fill="#4a90e2" />
      <text x="65" y="315" fill="#666" fontSize="12" fontFamily="sans-serif">Bluetooth Tenkey Pad</text>
      <text x="65" y="340" fill="#666" fontSize="16" fontWeight="bold" fontFamily="sans-serif">MCO TENBT03</text>
      {numpadKeys.map(k => (
        <KeyNode
          key={k.id}
          k={k}
          isSel={selectedKey === k.id}
          mappedCode={keymap[k.id]}
          onKeyClick={onKeyClick}
          isModified={defaults && JSON.stringify(keymap[k.id]) !== JSON.stringify(defaults[k.id])}
        />
      ))}
    </svg>
  );
}
