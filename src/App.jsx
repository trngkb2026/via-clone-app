import { useState, useRef } from 'react';
import { Download, Upload, Keyboard, CheckCircle2, Monitor, X } from 'lucide-react';
import NumpadSVG from './components/NumpadSVG';
import EwinSVG from './components/EwinSVG';
import { initNumpad, initEwin, numpadKeys, ewinKeys, keycodes, qmkToKarabiner } from './data/keymaps';

function App() {
  const fileInputRef = useRef(null);
  const [activeKb, setActiveKb] = useState('numpad');
  const [selectedKey, setSelectedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('Basic');
  const [toastMsg, setToastMsg] = useState('');
  const [showKarabinerModal, setShowKarabinerModal] = useState(false);
  const [keymaps, setKeymaps] = useState({ numpad: { ...initNumpad }, ewin: { ...initEwin } });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleKeyClick = (id) => setSelectedKey(id);

  const handleKeycodeClick = (code) => {
    if (!selectedKey) return;
    setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: code } }));
    const keys = activeKb === 'numpad' ? numpadKeys : ewinKeys;
    const idx = keys.findIndex(k => k.id === selectedKey);
    if (idx !== -1 && idx < keys.length - 1) setSelectedKey(keys[idx + 1].id);
    else setSelectedKey(null);
  };

  const switchKb = (kb) => { setActiveKb(kb); setSelectedKey(null); };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keymaps, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "via_keymap_backup.json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast('設定をJSONとして保存しました');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.numpad && imported.ewin) {
          setKeymaps(imported); showToast('設定を読み込みました');
        } else showToast("無効なファイル形式です");
      } catch { showToast("ファイルの読み込みに失敗しました"); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const generateKarabiner = () => {
    const manipulators = [];
    const defaultMap = activeKb === 'numpad' ? initNumpad : initEwin;
    const currentMap = keymaps[activeKb];

    Object.keys(defaultMap).forEach(keyId => {
      const origCode = defaultMap[keyId];
      const newCode = currentMap[keyId];
      if (origCode !== newCode) {
        const fromKey = qmkToKarabiner[origCode];
        const toKey = qmkToKarabiner[newCode];
        if (fromKey && toKey) {
          manipulators.push({
            type: "basic",
            from: { key_code: fromKey },
            to: [{ key_code: toKey }]
          });
        }
      }
    });

    if (manipulators.length === 0) {
      showToast('変更されたキーがありません');
      setShowKarabinerModal(false);
      return;
    }

    const karabinerJson = {
      title: `Custom Keyboard Layout (${activeKb})`,
      rules: [
        {
          description: `VIA Clone Custom Mapping for ${activeKb}`,
          manipulators: manipulators
        }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(karabinerJson, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "karabiner_custom_layout.json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-screen bg-[#141414] text-gray-300 font-sans select-none overflow-hidden relative">

      {/* Toast */}
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#00d8ff] text-black px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,216,255,0.4)] font-bold flex items-center gap-2">
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      </div>

      {/* Karabiner Modal */}
      {showKarabinerModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center modal-overlay">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-[500px] max-w-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-[#222] px-5 py-4 border-b border-[#333]">
              <h3 className="text-white font-bold flex items-center gap-2"><Monitor size={16} /> Mac (Karabiner)用書き出し</h3>
              <button onClick={() => setShowKarabinerModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 text-sm text-gray-300 leading-relaxed">
              <p className="mb-4">
                ここで設定したレイアウトを <b>Karabiner-Elements</b> に読み込ませるためのJSONファイルを生成します。<br />
                <span className="text-xs text-gray-500">※ デフォルト状態から変更されたキーのみがファイルに記録されます。</span>
              </p>
              <div className="bg-[#111] border border-[#333] rounded-lg p-4 mb-5">
                <h4 className="text-[#00d8ff] font-bold mb-2">使い方</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>下のボタンからJSONファイルをダウンロード。</li>
                  <li>MacのFinderで <code className="bg-[#2a2a2a] px-1 rounded text-[#ff0072]">~/.config/karabiner/assets/complex_modifications</code> を開く。</li>
                  <li>ダウンロードしたJSONファイルをそのフォルダに入れる。</li>
                  <li>Karabinerの設定画面 &gt; Complex Modifications &gt; Add rule から有効化する。</li>
                </ol>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowKarabinerModal(false)} className="px-4 py-2 rounded-lg bg-[#333] hover:bg-[#444] text-gray-300 transition-colors">キャンセル</button>
                <button onClick={() => { generateKarabiner(); setShowKarabinerModal(false); }} className="px-5 py-2 rounded-lg bg-[#00d8ff] hover:bg-[#00b8d9] text-black font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(0,216,255,0.3)] transition-all">
                  <Download size={16} /> JSONを生成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1e1e1e] border-b border-[#333] shadow-md z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-2xl tracking-widest text-white italic" style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>VIA</div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mt-1">
            Web Configurator
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#333]">
            <button onClick={() => switchKb('numpad')} className={`px-4 py-1.5 flex items-center gap-2 rounded-md text-sm font-medium transition-all ${activeKb === 'numpad' ? 'bg-[#333] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
              <Keyboard size={16} /> Numpad
            </button>
            <button onClick={() => switchKb('ewin')} className={`px-4 py-1.5 flex items-center gap-2 rounded-md text-sm font-medium transition-all ${activeKb === 'ewin' ? 'bg-[#333] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
              <Keyboard size={16} /> EWIN
            </button>
          </div>
          <div className="hidden md:flex gap-2 border-l border-[#333] pl-4">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-300 transition-colors" title="設定を読み込む"><Upload size={14} /></button>
            <button onClick={handleExport} className="p-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-300 transition-colors" title="設定を保存する"><Download size={14} /></button>
            <button onClick={() => setShowKarabinerModal(true)} className="ml-2 flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#252528] hover:bg-[#303035] border border-[#00d8ff44] text-[#00d8ff] font-medium text-sm transition-all hover:shadow-[0_0_8px_rgba(0,216,255,0.2)]">
              <Monitor size={16} /> Karabiner出力
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Visualizer */}
        <div className="flex-1 flex items-center justify-center p-6 relative" onClick={() => setSelectedKey(null)}>
          <div className="w-full h-full flex items-center justify-center transition-opacity duration-300">
            {activeKb === 'numpad'
              ? <NumpadSVG keymap={keymaps.numpad} selectedKey={selectedKey} onKeyClick={handleKeyClick} />
              : <EwinSVG keymap={keymaps.ewin} selectedKey={selectedKey} onKeyClick={handleKeyClick} />
            }
          </div>
          {!selectedKey && (
            <div className="absolute top-8 bg-[#222] text-[#888] px-4 py-2 rounded-full text-sm border border-[#333] shadow-lg pointer-events-none animate-pulse">
              上のキーボード画像から変更したいキーを選択してください
            </div>
          )}
        </div>

        {/* Keycode Palette */}
        <section className={`h-[280px] flex-shrink-0 bg-[#1e1e1e] border-t border-[#333] flex flex-col transition-transform duration-300 ${selectedKey ? 'translate-y-0' : 'translate-y-8 opacity-60'}`}>
          <div className="flex border-b border-[#333] bg-[#1a1a1a]">
            {Object.keys(keycodes).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium tracking-wide transition-colors relative ${activeTab === tab ? 'text-[#00d8ff]' : 'text-gray-500 hover:text-gray-300'}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00d8ff] shadow-[0_0_8px_#00d8ff]"></div>}
              </button>
            ))}
          </div>
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="flex flex-wrap gap-2 content-start">
              {keycodes[activeTab].map(kc => (
                <button key={kc.code} onClick={() => handleKeycodeClick(kc.code)} className="min-w-[50px] px-3 py-2.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#666]" title={kc.code}>
                  {kc.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
