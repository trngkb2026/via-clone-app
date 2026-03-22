import { useState, useRef, useEffect, useCallback } from 'react';
import { Keyboard, CheckCircle2, X, RotateCcw, Radio, Undo2, Plus, Trash2, Pencil } from 'lucide-react';
import NumpadSVG from './components/NumpadSVG';
import EwinSVG from './components/EwinSVG';
import { initNumpad, initEwin, numpadKeys, ewinKeys, keycodes, currentNumpadConfig, currentEwinConfig, generateKarabinerConfig, parseKarabinerConfig, qmkToKarabiner, getDisplayLabel, devices, eventCodeToKarabiner, karabinerKeyLabel } from './data/keymaps';

function CaptureFlash({ flash }) {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (flash) {
      setLabel(flash.label);
      setAnimKey(flash.id);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 900);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  if (!label) return null;

  return (
    <div
      key={animKey}
      style={{
        position: 'fixed',
        top: '45%',
        left: '30%',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6)',
        transition: visible ? 'opacity 0.1s, transform 0.15s ease-out' : 'opacity 0.4s 0.3s, transform 0.4s 0.3s ease-in',
      }}
    >
      <div style={{
        background: '#00d8ff',
        color: '#000',
        padding: '16px 40px',
        borderRadius: '16px',
        fontSize: '32px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        boxShadow: '0 0 40px rgba(0,216,255,0.6)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
    </div>
  );
}

function App() {
  const [activeKb, setActiveKb] = useState('numpad');
  const [selectedKey, setSelectedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('Basic');
  const [toastMsg, setToastMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeModifiers, setActiveModifiers] = useState([]);
  const [pendingCombo, setPendingCombo] = useState(null);
  const [pendingSeqKeys, setPendingSeqKeys] = useState([]);
  const [captureFlash, setCaptureFlash] = useState(null); // { label, id }
  const [verifyStatus, setVerifyStatus] = useState(null); // null | 'checking' | { readBack, deviceConnected, configReloaded, errors }
  const [keyCaptureMode, setKeyCaptureMode] = useState(false);
  const [capturedEvents, setCapturedEvents] = useState([]);
  const [keymaps, setKeymaps] = useState({
    numpad: { ...initNumpad },
    ewin: { ...initEwin },
  });
  const initialLoadDone = useRef(false);
  const syncEnabled = useRef(false);
  const undoStack = useRef([]); // Stack of previous keymap states for undo
  const MAX_UNDO = 50;
  const [customSeqPresets, setCustomSeqPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('via_custom_seq_presets') || '[]'); } catch { return []; }
  });

  const defaults = { numpad: initNumpad, ewin: initEwin };

  // Auto-load karabiner.json on startup
  useEffect(() => {
    const loadConfig = async () => {
      try {
        let result;
        if (window.karabiner?.readConfig) {
          result = await window.karabiner.readConfig();
        } else {
          const res = await fetch('/api/read-karabiner');
          result = await res.json();
        }
        if (result?.success) {
          const numpadConfig = parseKarabinerConfig(result.data, 'numpad');
          const ewinConfig = parseKarabinerConfig(result.data, 'ewin');
          setKeymaps({
            numpad: { ...initNumpad, ...numpadConfig },
            ewin: { ...initEwin, ...ewinConfig },
          });
        }
      } catch {
        // karabiner.json読み取り失敗時のみハードコード値をフォールバックとして使用
        setKeymaps({
          numpad: { ...initNumpad, ...currentNumpadConfig },
          ewin: { ...initEwin, ...currentEwinConfig },
        });
      }
      initialLoadDone.current = true;
      // setKeymapsのstate更新→再レンダー→useEffect実行を確実に通過させてからsyncを有効化
      // requestAnimationFrameだけではReactのバッチ更新と競合するリスクがあるため、十分な遅延を確保
      setTimeout(() => { syncEnabled.current = true; }, 300);
    };
    loadConfig();
  }, []);

  // Auto-sync to karabiner.json on keymap change (debounced)
  useEffect(() => {
    if (!syncEnabled.current) return;
    const timer = setTimeout(async () => {
      let allSuccess = true;
      const syncedPayloads = [];
      for (const kb of ['numpad', 'ewin']) {
        const config = generateKarabinerConfig(keymaps[kb], kb, defaults[kb]);
        const manipulators = config.rules[0].manipulators;
        const managedFromKeys = config.managedFromKeys;
        if (!managedFromKeys || managedFromKeys.length === 0) {
          console.error(`GUARDRAIL: managedFromKeys is empty for ${kb}. Sync aborted to prevent silent data loss.`);
          showToast(`⚠ 同期中止: ${kb}のmanagedFromKeysが空です`);
          allSuccess = false;
          continue;
        }
        const device = devices[kb];
        const payload = { device, manipulators, managedFromKeys };
        const syncTimestamp = Date.now();
        try {
          let result;
          if (window.karabiner?.sync) {
            result = await window.karabiner.sync(payload);
          } else {
            const res = await fetch('/api/sync-karabiner', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            result = await res.json();
          }
          if (!result?.success) {
            console.error(`Karabiner sync failed (${kb}):`, result?.error);
            allSuccess = false;
            showToast(`⚠ 同期失敗: ${result?.error || '不明なエラー'}`);
          } else {
            syncedPayloads.push({ device, manipulators, syncTimestamp });
          }
        } catch (err) {
          console.error(`Karabiner sync error (${kb}):`, err);
          allSuccess = false;
          showToast(`⚠ 同期エラー: ${err.message}`);
        }
      }
      if (allSuccess && syncedPayloads.length > 0) {
        // Auto-verify after 1s (wait for Karabiner to reload)
        setTimeout(async () => {
          setVerifyStatus('checking');
          const allChecks = { readBack: true, deviceConnected: true, configReloaded: false, errors: [] };
          for (const { device, manipulators, syncTimestamp } of syncedPayloads) {
            try {
              let checks;
              if (window.karabiner?.verify) {
                checks = await window.karabiner.verify({ device, manipulators, syncTimestamp });
              } else {
                const res = await fetch('/api/verify-karabiner', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ device, manipulators, syncTimestamp }),
                });
                checks = await res.json();
              }
              if (!checks.readBack) allChecks.readBack = false;
              if (!checks.deviceConnected) allChecks.deviceConnected = false;
              if (checks.configReloaded) allChecks.configReloaded = true;
              allChecks.errors.push(...(checks.errors || []));
            } catch (err) {
              allChecks.errors.push(err.message);
            }
          }
          allChecks.success = allChecks.readBack && allChecks.deviceConnected;
          setVerifyStatus(allChecks);
          if (!allChecks.success) {
            showToast(`⚠ 検証失敗: ${allChecks.errors.join(', ')}`);
          }
          // Clear after 8s
          setTimeout(() => setVerifyStatus(null), 8000);
        }, 1000);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [keymaps]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Undo: save current state before mutation
  const pushUndo = () => {
    undoStack.current = [...undoStack.current.slice(-(MAX_UNDO - 1)), JSON.parse(JSON.stringify(keymaps))];
  };

  const handleUndo = () => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop();
    setKeymaps(prev);
    showToast('↩ 元に戻しました');
  };

  const handleKeyClick = (id) => setSelectedKey(id);

  const modSymbols = { command: '⌘', shift: '⇧', option: '⌥', control: '⌃' };

  const toggleModifier = (mod) => {
    setActiveModifiers(prev => {
      const next = prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod];
      setPendingCombo(pc => ({ modifiers: next, key_code: pc?.key_code || null, keyLabel: pc?.keyLabel || null }));
      return next;
    });
  };

  const advanceToNextKey = () => {
    const keys = activeKb === 'numpad' ? numpadKeys : ewinKeys;
    const idx = keys.findIndex(k => k.id === selectedKey);
    if (idx !== -1 && idx < keys.length - 1) setSelectedKey(keys[idx + 1].id);
    else setSelectedKey(null);
  };

  const handleKeycodeClick = (code) => {
    if (!selectedKey) return;

    // Combo mode: modifiers active + simple key → stage in preview, don't assign yet
    if (activeModifiers.length > 0 && typeof code === 'string') {
      const kbKey = qmkToKarabiner[code];
      if (kbKey) {
        setPendingCombo({
          modifiers: [...activeModifiers],
          key_code: kbKey,
          keyLabel: getDisplayLabel(code),
        });
        return;
      }
    }

    // Direct mode: assign immediately
    pushUndo();
    setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: code } }));
    advanceToNextKey();
  };

  // Sequence builder: add a key to the pending sequence
  const addKeyToSeq = (keyObj) => {
    if (!selectedKey) return;
    setPendingSeqKeys(prev => [...prev, keyObj]);
  };

  const handleSeqConfirm = () => {
    if (!selectedKey || pendingSeqKeys.length === 0) return;
    const labels = pendingSeqKeys.map(k => k._label);
    const shortLabel = labels.length <= 4 ? labels.join('→') : `${labels[0]}→..→${labels[labels.length-1]}(${labels.length})`;
    const finalCode = {
      type: 'sequence',
      keys: pendingSeqKeys.map(({ _label, ...rest }) => rest),
      label: shortLabel.length > 10 ? shortLabel.substring(0, 9) + '…' : shortLabel,
    };
    pushUndo();
    setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: finalCode } }));
    setPendingSeqKeys([]);
    advanceToNextKey();
  };

  const handleSeqUndo = () => {
    setPendingSeqKeys(prev => prev.slice(0, -1));
  };

  const saveSeqPreset = () => {
    if (pendingSeqKeys.length === 0) return;
    const labels = pendingSeqKeys.map(k => k._label);
    const shortLabel = labels.length <= 4 ? labels.join('→') : `${labels[0]}→..→${labels[labels.length-1]}(${labels.length})`;
    const preset = {
      id: `custom_seq_${Date.now()}`,
      code: {
        type: 'sequence',
        keys: pendingSeqKeys.map(({ _label, ...rest }) => rest),
        label: shortLabel.length > 10 ? shortLabel.substring(0, 9) + '…' : shortLabel,
      },
      label: shortLabel,
    };
    const updated = [...customSeqPresets, preset];
    setCustomSeqPresets(updated);
    localStorage.setItem('via_custom_seq_presets', JSON.stringify(updated));
    setPendingSeqKeys([]);
    showToast(`✔ プリセット保存: ${shortLabel}`);
  };

  const deleteSeqPreset = (id) => {
    const updated = customSeqPresets.filter(p => p.id !== id);
    setCustomSeqPresets(updated);
    localStorage.setItem('via_custom_seq_presets', JSON.stringify(updated));
    showToast('プリセットを削除しました');
  };

  // Preset editor state
  const [editingPreset, setEditingPreset] = useState(null); // { id, keys: [...with _label] }
  const [editorCapturing, setEditorCapturing] = useState(false);

  const openPresetEditor = (preset) => {
    const keysWithLabels = preset.code.keys.map(k => {
      const isLetter = /^[a-z]$/.test(k.key_code);
      const hasShift = k.modifiers?.some(m => m === 'left_shift' || m === 'shift');
      let label;
      if (isLetter) {
        label = hasShift ? k.key_code.toUpperCase() : k.key_code;
      } else {
        label = karabinerKeyLabel[k.key_code] || k.consumer_key_code || k.key_code || '?';
      }
      return { ...k, _label: label };
    });
    setEditingPreset({ id: preset.id, keys: keysWithLabels });
    setEditorCapturing(false);
  };

  const closePresetEditor = () => {
    setEditingPreset(null);
    setEditorCapturing(false);
  };

  const editorRemoveKey = (idx) => {
    setEditingPreset(prev => ({ ...prev, keys: prev.keys.filter((_, i) => i !== idx) }));
  };

  const editorMoveKey = (idx, dir) => {
    setEditingPreset(prev => {
      const keys = [...prev.keys];
      const target = idx + dir;
      if (target < 0 || target >= keys.length) return prev;
      [keys[idx], keys[target]] = [keys[target], keys[idx]];
      return { ...prev, keys };
    });
  };

  const editorAddKey = (keyObj) => {
    setEditingPreset(prev => ({ ...prev, keys: [...prev.keys, keyObj] }));
  };

  const editorSave = () => {
    if (!editingPreset || editingPreset.keys.length === 0) return;
    const labels = editingPreset.keys.map(k => k._label);
    const shortLabel = labels.length <= 4 ? labels.join('→') : `${labels[0]}→..→${labels[labels.length-1]}(${labels.length})`;
    const updated = customSeqPresets.map(p => p.id === editingPreset.id ? {
      ...p,
      code: {
        type: 'sequence',
        keys: editingPreset.keys.map(({ _label, ...rest }) => rest),
        label: shortLabel.length > 10 ? shortLabel.substring(0, 9) + '…' : shortLabel,
      },
      label: shortLabel,
    } : p);
    setCustomSeqPresets(updated);
    localStorage.setItem('via_custom_seq_presets', JSON.stringify(updated));
    setEditingPreset(null);
    showToast(`✔ プリセット更新: ${shortLabel}`);
  };

  // Editor capture: listen for keystrokes and add to editing preset
  useEffect(() => {
    if (!editorCapturing || !editingPreset) return;
    const handler = (e) => {
      if (['ShiftLeft','ShiftRight','ControlLeft','ControlRight','AltLeft','AltRight','MetaLeft','MetaRight'].includes(e.code)) return;
      e.preventDefault();
      e.stopPropagation();
      const kbKey = eventCodeToKarabiner[e.code];
      if (!kbKey) return;
      const isLetter = /^[a-z]$/.test(kbKey);
      const keyObj = { key_code: kbKey };
      if (isLetter && e.shiftKey) {
        keyObj.modifiers = ['left_shift'];
        keyObj._label = kbKey.toUpperCase();
      } else if (isLetter) {
        keyObj._label = kbKey;
      } else {
        keyObj._label = karabinerKeyLabel[kbKey] || kbKey;
      }
      setEditingPreset(prev => prev ? { ...prev, keys: [...prev.keys, keyObj] } : prev);
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [editorCapturing, editingPreset]);

  // Capture keystroke from physical keyboard
  const handleCapture = useCallback((e) => {
    if (!selectedKey) return;
    // Ignore modifier-only presses
    if (['ShiftLeft','ShiftRight','ControlLeft','ControlRight','AltLeft','AltRight','MetaLeft','MetaRight'].includes(e.code)) return;
    e.preventDefault();
    e.stopPropagation();

    const kbKey = eventCodeToKarabiner[e.code];
    if (!kbKey) return;
    const label = karabinerKeyLabel[kbKey] || kbKey;

    // Detect modifiers
    const mods = [];
    if (e.metaKey) mods.push('command');
    if (e.shiftKey) mods.push('shift');
    if (e.altKey) mods.push('option');
    if (e.ctrlKey) mods.push('control');

    // Flash animation
    const modSyms = { command: '⌘', shift: '⇧', option: '⌥', control: '⌃' };
    const flashLabel = (mods.length > 0 ? mods.map(m => modSyms[m]).join('') + ' + ' : '') + label;
    setCaptureFlash({ label: flashLabel, id: Date.now() });

    if (activeTab === 'Sequence') {
      // Sequence mode: add to sequence
      const isLetter = /^[a-z]$/.test(kbKey);
      const seqLabel = isLetter ? (e.shiftKey ? kbKey.toUpperCase() : kbKey) : label;
      const keyObj = { key_code: kbKey, _label: seqLabel };
      if (mods.length > 0) keyObj.modifiers = mods;
      setPendingSeqKeys(prev => [...prev, keyObj]);
    } else if (mods.length > 0) {
      // Combo: assign directly
      const modSyms = { command: '⌘', shift: '⇧', option: '⌥', control: '⌃' };
      const modLabel = mods.map(m => modSyms[m]).join('');
      const finalCode = { type: 'combo', key_code: kbKey, modifiers: mods, label: `${modLabel}${label}` };
      pushUndo();
      setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: finalCode } }));
      setCapturing(false);
      advanceToNextKey();
    } else {
      // Simple key: find QMK code or use system type
      pushUndo();
      const qmk = Object.entries(qmkToKarabiner).find(([, v]) => v === kbKey)?.[0];
      if (qmk) {
        setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: qmk } }));
      } else {
        setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: { type: 'system', key_code: kbKey, label } } }));
      }
      setCapturing(false);
      advanceToNextKey();
    }
  }, [selectedKey, activeTab, activeKb]);

  useEffect(() => {
    if (selectedKey && !keyCaptureMode) {
      window.addEventListener('keydown', handleCapture, true);
      return () => window.removeEventListener('keydown', handleCapture, true);
    }
  }, [selectedKey, handleCapture, keyCaptureMode]);

  // Global keyboard shortcuts: Escape to deselect, ⌘Z to undo
  useEffect(() => {
    const handler = (e) => {
      if (keyCaptureMode) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedKey(null);
        setPendingCombo(null);
        setActiveModifiers([]);
        setPendingSeqKeys([]);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !selectedKey) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyCaptureMode, selectedKey]);

  const handleComboConfirm = () => {
    if (!selectedKey || !pendingCombo?.key_code) return;
    const modLabel = pendingCombo.modifiers.map(m => modSymbols[m]).join('');
    const finalCode = {
      type: 'combo',
      key_code: pendingCombo.key_code,
      modifiers: pendingCombo.modifiers,
      label: `${modLabel}${pendingCombo.keyLabel}`,
    };
    pushUndo();
    setKeymaps(prev => ({ ...prev, [activeKb]: { ...prev[activeKb], [selectedKey]: finalCode } }));
    setPendingCombo(null);
    setActiveModifiers([]);
    advanceToNextKey();
  };

  const handleComboUndo = () => {
    if (!pendingCombo) return;
    if (pendingCombo.key_code) {
      setPendingCombo(prev => ({ ...prev, key_code: null, keyLabel: null }));
    } else if (activeModifiers.length > 0) {
      const newMods = activeModifiers.slice(0, -1);
      setActiveModifiers(newMods);
      if (newMods.length === 0) {
        setPendingCombo(null);
      } else {
        setPendingCombo(prev => ({ ...prev, modifiers: newMods }));
      }
    }
  };

  const handleComboClear = () => {
    setPendingCombo(null);
    setActiveModifiers([]);
  };

  // Key Capture Mode: listen for raw key events
  useEffect(() => {
    if (!keyCaptureMode) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const entry = {
        id: Date.now(),
        type: e.type,
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      };
      setCapturedEvents(prev => [entry, ...prev].slice(0, 30));
    };
    window.addEventListener('keydown', handler, true);
    window.addEventListener('keyup', handler, true);
    return () => {
      window.removeEventListener('keydown', handler, true);
      window.removeEventListener('keyup', handler, true);
    };
  }, [keyCaptureMode]);

  const switchKb = (kb) => { setActiveKb(kb); setSelectedKey(null); };

  const handleReset = () => {
    pushUndo();
    setKeymaps(prev => ({
      ...prev,
      [activeKb]: activeKb === 'numpad'
        ? { ...initNumpad, ...currentNumpadConfig }
        : { ...initEwin, ...currentEwinConfig }
    }));
    setSelectedKey(null);
    setShowResetConfirm(false);
    showToast(`${activeKb === 'numpad' ? 'Numpad' : 'EWIN'} をリセットしました`);
  };


  const modifiedCount = Object.keys(keymaps[activeKb]).filter(k =>
    JSON.stringify(keymaps[activeKb][k]) !== JSON.stringify(defaults[activeKb][k])
  ).length;

  const tabColors = {
    Shortcuts: 'text-[#00d8ff]', Sequence: 'text-[#ffb800]',
  };

  return (
    <div className="flex flex-col h-screen bg-[#141414] text-gray-300 font-sans select-none overflow-hidden relative">

      {/* Toast */}
      <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#00d8ff] text-black px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,216,255,0.4)] font-bold flex items-center gap-2">
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      </div>

      {/* Capture Flash */}
      <CaptureFlash flash={captureFlash} />

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center modal-overlay">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-[400px] max-w-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-[#222] px-5 py-4 border-b border-[#333]">
              <h3 className="text-white font-bold flex items-center gap-2"><RotateCcw size={16} /> リセット確認</h3>
              <button onClick={() => setShowResetConfirm(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 text-sm text-gray-300 leading-relaxed">
              <p className="mb-4">
                <b className="text-white">{activeKb === 'numpad' ? 'Numpad (TENBT03)' : 'EWIN X8'}</b> のキーマップを<br />
                現在のKarabiner設定の状態にリセットします。
              </p>
              <p className="text-xs text-gray-500 mb-5">※ 未保存の変更（{modifiedCount}件）はすべて失われます。</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 rounded-lg bg-[#333] hover:bg-[#444] text-gray-300 transition-colors">キャンセル</button>
                <button onClick={handleReset} className="px-5 py-2 rounded-lg bg-[#e61938] hover:bg-[#cc1530] text-white font-bold flex items-center gap-2 transition-all">
                  <RotateCcw size={16} /> リセットする
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Editor Modal */}
      {editingPreset && (
        <div className="absolute inset-0 z-50 flex items-center justify-center modal-overlay" onClick={closePresetEditor}>
          <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl w-[520px] max-w-full overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center bg-[#222] px-5 py-4 border-b border-[#333]">
              <h3 className="text-white font-bold flex items-center gap-2"><Pencil size={16} /> プリセット編集</h3>
              <button onClick={closePresetEditor} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5">
              {/* Current sequence keys */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">シーケンス内容</div>
                <div className={`flex flex-wrap gap-2 min-h-[44px] p-3 bg-[#111] rounded-lg border ${editorCapturing ? 'border-green-500/50 shadow-[0_0_8px_rgba(0,255,136,0.15)]' : 'border-[#333]'} transition-all`}>
                  {editingPreset.keys.length === 0 && <span className="text-gray-600 text-xs">キーがありません</span>}
                  {editingPreset.keys.map((k, i) => (
                    <div key={i} className="flex items-center gap-0.5 bg-[#2c2c2e] border border-[#ffb80055] rounded-md px-1 group/item">
                      <button onClick={() => editorMoveKey(i, -1)} disabled={i === 0}
                        className={`px-1 py-1.5 text-[10px] ${i === 0 ? 'text-gray-700' : 'text-gray-500 hover:text-white'}`}>◀</button>
                      <span className="px-1.5 py-1.5 text-xs font-semibold text-[#ffb800]">{k._label}</span>
                      <button onClick={() => editorMoveKey(i, 1)} disabled={i === editingPreset.keys.length - 1}
                        className={`px-1 py-1.5 text-[10px] ${i === editingPreset.keys.length - 1 ? 'text-gray-700' : 'text-gray-500 hover:text-white'}`}>▶</button>
                      <button onClick={() => editorRemoveKey(i)}
                        className="px-1 py-1.5 text-gray-600 hover:text-red-400 text-[10px]">✕</button>
                    </div>
                  ))}
                  {editorCapturing && <span className="text-green-400 text-xs animate-pulse ml-1">入力待ち...</span>}
                </div>
              </div>
              {/* Capture toggle */}
              <div className="mb-4 flex items-center gap-3">
                <button onClick={() => setEditorCapturing(c => !c)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${editorCapturing
                    ? 'bg-green-900/40 text-green-400 border border-green-500/50 shadow-[0_0_8px_rgba(0,255,136,0.2)]'
                    : 'bg-[#2c2c2e] text-gray-400 hover:bg-[#3a3a3c] border border-[#444]'}`}>
                  <Radio size={14} />
                  {editorCapturing ? 'キャプチャ停止' : 'キーボードで入力'}
                </button>
                {editorCapturing && (
                  <span className="flex items-center gap-1.5 text-[10px] text-green-400/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    キーを押すとシーケンスに追加されます
                  </span>
                )}
              </div>
              {/* Add keys (button palette) */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">ボタンで追加</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key_code: 'up_arrow', label: '↑' }, { key_code: 'down_arrow', label: '↓' },
                    { key_code: 'left_arrow', label: '←' }, { key_code: 'right_arrow', label: '→' },
                    { key_code: 'return_or_enter', label: 'Ent' }, { key_code: 'spacebar', label: 'Space' },
                    { key_code: 'tab', label: 'Tab' }, { key_code: 'escape', label: 'Esc' },
                    { key_code: 'delete_or_backspace', label: 'Back' }, { key_code: 'delete_forward', label: 'Del' },
                    { key_code: 'japanese_eisuu', label: '英数' }, { key_code: 'japanese_kana', label: 'かな' },
                    { key_code: 'page_up', label: 'PgUp' }, { key_code: 'page_down', label: 'PgDn' },
                    { key_code: 'home', label: 'Home' }, { key_code: 'end', label: 'End' },
                  ].map(k => (
                    <button key={k.key_code} onClick={() => editorAddKey({ key_code: k.key_code, _label: k.label })}
                      className="px-2.5 py-1.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] rounded text-xs text-gray-400 hover:text-white border border-[#444] hover:border-[#ffb800] transition-all">
                      {k.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {'abcdefghijklmnopqrstuvwxyz'.split('').map(ch => (
                    <button key={`lo_${ch}`} onClick={() => editorAddKey({ key_code: ch, _label: ch })}
                      className="w-7 py-1 bg-[#2c2c2e] hover:bg-[#4a4a4c] rounded text-xs text-gray-400 hover:text-white border border-[#444] hover:border-[#ffb800] transition-all text-center">
                      {ch}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {'abcdefghijklmnopqrstuvwxyz'.split('').map(ch => (
                    <button key={`up_${ch}`} onClick={() => editorAddKey({ key_code: ch, modifiers: ['left_shift'], _label: ch.toUpperCase() })}
                      className="w-7 py-1 bg-[#2c2c2e] hover:bg-[#4a4a4c] rounded text-xs font-bold text-gray-400 hover:text-white border border-[#444] hover:border-[#ffb800] transition-all text-center">
                      {ch.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.from({length: 10}, (_, i) => (
                    <button key={i} onClick={() => editorAddKey({ key_code: `keypad_${i}`, _label: `${i}` })}
                      className="w-7 py-1 bg-[#2c2c2e] hover:bg-[#4a4a4c] rounded text-xs text-gray-400 hover:text-white border border-[#444] hover:border-[#ffb800] transition-all text-center">
                      {i}
                    </button>
                  ))}
                  {[
                    { key_code: 'comma', label: ',' }, { key_code: 'period', label: '.' },
                    { key_code: 'slash', label: '/' }, { key_code: 'hyphen', label: '-' },
                    { key_code: 'semicolon', label: ';' }, { key_code: 'quote', label: "'" },
                  ].map(k => (
                    <button key={k.key_code} onClick={() => editorAddKey({ key_code: k.key_code, _label: k.label })}
                      className="w-7 py-1 bg-[#2c2c2e] hover:bg-[#4a4a4c] rounded text-xs text-gray-400 hover:text-white border border-[#444] hover:border-[#ffb800] transition-all text-center">
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div className="flex justify-between items-center">
                <button onClick={() => { deleteSeqPreset(editingPreset.id); closePresetEditor(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors">
                  <Trash2 size={14} /> 削除
                </button>
                <div className="flex gap-2">
                  <button onClick={closePresetEditor}
                    className="px-4 py-2 rounded-lg bg-[#333] hover:bg-[#444] text-gray-300 text-xs transition-colors">キャンセル</button>
                  <button onClick={() => { editorSave(); setEditorCapturing(false); }} disabled={editingPreset.keys.length === 0}
                    className={`px-5 py-2 rounded-lg font-bold text-xs transition-all ${editingPreset.keys.length > 0 ? 'bg-[#ffb800] hover:bg-[#e6a600] text-black' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag Bar */}
      <div className="drag-region h-6 bg-[#1e1e1e] flex-shrink-0" />

      {/* Header */}
      <header className="drag-region flex items-center justify-between px-6 py-3 bg-[#1e1e1e] border-b border-[#333] shadow-md z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-2xl tracking-widest text-white italic pl-16" style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>VIA</div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mt-1">
            Configurator
          </div>
          {modifiedCount > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs bg-[#00d8ff22] text-[#00d8ff] px-2 py-1 rounded-full border border-[#00d8ff33]">
              {modifiedCount} 変更
            </div>
          )}
        </div>
        <div className="no-drag flex gap-4 items-center">
          <div className="flex bg-[#111] rounded-lg p-1 border border-[#333]">
            <button onClick={() => switchKb('numpad')} className={`px-4 py-1.5 flex items-center gap-2 rounded-md text-sm font-medium transition-all ${activeKb === 'numpad' ? 'bg-[#333] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
              <Keyboard size={16} /> Numpad
            </button>
            <button onClick={() => switchKb('ewin')} className={`px-4 py-1.5 flex items-center gap-2 rounded-md text-sm font-medium transition-all ${activeKb === 'ewin' ? 'bg-[#333] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
              <Keyboard size={16} /> EWIN
            </button>
          </div>
          <div className="hidden md:flex gap-2 border-l border-[#333] pl-4">
            <button onClick={handleUndo} disabled={undoStack.current.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${undoStack.current.length > 0 ? 'bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-400' : 'bg-[#222] text-gray-600 cursor-not-allowed'}`}
              title="元に戻す (Undo)"><Undo2 size={14} /> Undo</button>
            <button onClick={() => setShowResetConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-400 text-xs transition-colors" title="リセット"><RotateCcw size={14} /> Reset</button>
            <button onClick={() => { setKeyCaptureMode(m => !m); if (!keyCaptureMode) { setCapturedEvents([]); setSelectedKey(null); } }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${keyCaptureMode ? 'bg-red-900/50 text-red-400 border border-red-500/50' : 'bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-400'}`}
              title="キーキャプチャモード"><Radio size={14} /> {keyCaptureMode ? 'Capturing...' : 'Capture'}</button>
            <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-[#00d8ff] bg-[#00d8ff11] border border-[#00d8ff33]">
              <span className="w-2 h-2 rounded-full bg-[#00d8ff] animate-pulse" /> Auto Sync
            </div>
            {verifyStatus && (
              <div className={`ml-1 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border transition-all ${
                verifyStatus === 'checking'
                  ? 'text-yellow-400 bg-yellow-400/5 border-yellow-400/30'
                  : verifyStatus.success
                    ? 'text-green-400 bg-green-400/5 border-green-400/30'
                    : 'text-red-400 bg-red-400/5 border-red-400/30'
              }`} title={verifyStatus !== 'checking' && verifyStatus.errors?.length ? verifyStatus.errors.join('\n') : ''}>
                {verifyStatus === 'checking' ? (
                  <><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> Verifying...</>
                ) : verifyStatus.success ? (
                  <><CheckCircle2 size={14} /> Verified
                    {verifyStatus.readBack && <span className="opacity-60">File</span>}
                    {verifyStatus.deviceConnected && <span className="opacity-60">Device</span>}
                    {verifyStatus.configReloaded && <span className="opacity-60">Reload</span>}
                  </>
                ) : (
                  <><X size={14} /> Failed
                    {!verifyStatus.readBack && <span className="opacity-60">File</span>}
                    {!verifyStatus.deviceConnected && <span className="opacity-60">Device</span>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main: Left-Right Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Device Visualizer */}
        <div className="w-[60%] flex flex-col border-r border-[#333]">
          <div className="flex-1 flex items-center justify-center p-4 relative" onClick={() => setSelectedKey(null)}>
            <div className="w-full h-full flex items-center justify-center transition-opacity duration-300">
              {activeKb === 'numpad'
                ? <NumpadSVG keymap={keymaps.numpad} selectedKey={selectedKey} onKeyClick={handleKeyClick} defaults={defaults.numpad} />
                : <EwinSVG keymap={keymaps.ewin} selectedKey={selectedKey} onKeyClick={handleKeyClick} defaults={defaults.ewin} />
              }
            </div>
            {!selectedKey && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#222] text-[#888] px-4 py-2 rounded-full text-xs border border-[#333] shadow-lg pointer-events-none animate-pulse">
                キーを選択してください
              </div>
            )}
          </div>
          {/* Key Capture Panel */}
          {keyCaptureMode && (
            <div className="border-t border-red-500/30 bg-[#1a0a0a] flex flex-col" style={{ height: '40%' }}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-red-500/20">
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Key Capture — 任意のキーを押してください（Karabiner処理後の出力を表示）
                </div>
                <button onClick={() => setCapturedEvents([])} className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded bg-[#2c2c2e]">Clear</button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs space-y-1">
                {capturedEvents.length === 0 && (
                  <div className="text-gray-600 text-center py-8">キーイベント待ち...</div>
                )}
                {capturedEvents.map((ev) => {
                  const mods = [];
                  if (ev.metaKey) mods.push('⌘');
                  if (ev.shiftKey) mods.push('⇧');
                  if (ev.altKey) mods.push('⌥');
                  if (ev.ctrlKey) mods.push('⌃');
                  const modStr = mods.length ? mods.join('') + ' + ' : '';
                  const isDown = ev.type === 'keydown';
                  return (
                    <div key={ev.id} className={`flex items-center gap-3 px-3 py-1.5 rounded ${isDown ? 'bg-[#221111] border-l-2 border-red-500' : 'bg-[#1a1a1a] border-l-2 border-gray-700 opacity-60'}`}>
                      <span className={`w-8 text-center ${isDown ? 'text-red-400' : 'text-gray-600'}`}>{isDown ? '▼' : '▲'}</span>
                      <span className="text-white font-bold min-w-[160px]">{modStr}{ev.code}</span>
                      <span className="text-green-400">key="{ev.key}"</span>
                      <span className="text-yellow-400">keyCode={ev.keyCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 py-2 text-[10px] tracking-wide border-t border-[#333] bg-[#1a1a1a]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e5e5e5] inline-block"></span> Simple</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00d8ff] inline-block"></span> Shortcut</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ffb800] inline-block"></span> Macro</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00ff88] inline-block"></span> Consumer</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#b388ff] inline-block"></span> System</span>
          </div>
        </div>

        {/* Right: Keycode Palette */}
        <div className={`w-[40%] flex flex-col bg-[#1e1e1e] transition-opacity duration-200 ${selectedKey ? 'opacity-100' : 'opacity-50'}`} style={{ fontSize: '120%' }}>
          {/* Preview Bar */}
          <div className={`flex items-center gap-3 px-4 py-2 border-b transition-colors ${activeTab === 'Sequence' && pendingSeqKeys.length > 0 ? 'bg-[#1a1400] border-[#ffb80033]' : pendingCombo || activeModifiers.length > 0 ? 'bg-[#0a1a22] border-[#00d8ff33]' : 'bg-[#1a1a1a] border-[#333]'}`}>
            <div className="flex-1 bg-[#111] rounded-lg px-4 py-2 text-white font-mono text-base min-h-[36px] flex items-center border border-[#333] overflow-x-auto">
              {activeTab === 'Sequence' ? (
                pendingSeqKeys.length > 0
                  ? <span>{pendingSeqKeys.map((k, i) => <span key={i}>{i > 0 && <span className="text-gray-500"> → </span>}<span className="text-[#ffb800]">{k._label}</span></span>)}</span>
                  : <span className="text-gray-500">キーを順番にクリックしてシーケンスを作成</span>
              ) : pendingCombo ? (
                <span>
                  {pendingCombo.modifiers.map(m => modSymbols[m]).join(' + ')}
                  {pendingCombo.key_code ? <span className="text-[#00d8ff]"> + {pendingCombo.keyLabel}</span> : <span className="text-gray-500 animate-pulse"> + キーを選択</span>}
                </span>
              ) : activeModifiers.length > 0 ? (
                <span>{activeModifiers.map(m => modSymbols[m]).join(' + ')} + <span className="text-gray-500 animate-pulse">キーを選択</span></span>
              ) : (
                <span className="text-gray-600">Key combo</span>
              )}
            </div>
            {activeTab === 'Sequence' ? (
              <>
                <button tabIndex={-1} onClick={handleSeqUndo} disabled={pendingSeqKeys.length === 0}
                  className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${pendingSeqKeys.length > 0 ? 'bg-[#3a5a6a] hover:bg-[#4a6a7a] text-white' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                  ←
                </button>
                <button tabIndex={-1} onClick={handleSeqConfirm} disabled={pendingSeqKeys.length === 0}
                  className={`px-5 py-2 rounded-lg font-bold text-base transition-all ${pendingSeqKeys.length > 0 ? 'bg-[#ffb800] hover:bg-[#e6a600] text-black shadow-[0_0_10px_rgba(255,184,0,0.3)]' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                  確定
                </button>
              </>
            ) : (
              <>
                <button tabIndex={-1} onClick={handleComboUndo} disabled={!pendingCombo && activeModifiers.length === 0}
                  className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${pendingCombo || activeModifiers.length > 0 ? 'bg-[#3a5a6a] hover:bg-[#4a6a7a] text-white' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                  ←
                </button>
                <button tabIndex={-1} onClick={handleComboConfirm} disabled={!pendingCombo?.key_code}
                  className={`px-5 py-2 rounded-lg font-bold text-base transition-all ${pendingCombo?.key_code ? 'bg-[#00d8ff] hover:bg-[#00b8d9] text-black shadow-[0_0_10px_rgba(0,216,255,0.3)]' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                  確定
                </button>
              </>
            )}
          </div>
          {/* Modifier Row + Capture */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
            {activeTab !== 'Sequence' && [
              { key: 'command', label: 'Cmd' },
              { key: 'shift', label: 'Shift' },
              { key: 'option', label: 'Alt/Opt' },
              { key: 'control', label: 'Ctrl' },
            ].map(mod => (
              <button key={mod.key} onClick={() => toggleModifier(mod.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeModifiers.includes(mod.key) ? 'bg-[#2a6a7a] text-[#00d8ff] border border-[#00d8ff] shadow-[0_0_6px_rgba(0,216,255,0.3)]' : 'bg-[#2c2c2e] text-gray-400 hover:bg-[#3a3a3c] hover:text-gray-200 border border-[#444]'}`}>
                {mod.label}
              </button>
            ))}
            {(pendingCombo || activeModifiers.length > 0) && (
              <button onClick={handleComboClear} className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded bg-[#2c2c2e] border border-[#444] transition-colors">Clear</button>
            )}
            {selectedKey && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> キーボード入力OK
              </span>
            )}
          </div>
          {/* Tab Bar */}
          <div className="flex border-b border-[#333] bg-[#1a1a1a] overflow-x-auto shrink-0">
            {Object.keys(keycodes).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium tracking-wide transition-colors relative whitespace-nowrap ${activeTab === tab ? (tabColors[tab] || 'text-[#00d8ff]') : 'text-gray-500 hover:text-gray-300'}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00d8ff] shadow-[0_0_8px_#00d8ff]"></div>}
              </button>
            ))}
          </div>
          {/* Key Grid */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex flex-wrap gap-2 content-start">
              {activeTab === 'Sequence' ? (
                <>
                  {/* Presets (built-in + custom) */}
                  <div className="w-full mb-1"><span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Presets</span></div>
                  {keycodes.Sequence.filter(kc => !kc.section).map(kc => (
                    <button key={kc.id} onClick={() => handleKeycodeClick(kc.code)}
                      className="min-w-[48px] px-3 py-2.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#ffb80055] text-center text-gray-300 transition-all active:scale-95 hover:border-[#666]">
                      {kc.label}
                    </button>
                  ))}
                  {customSeqPresets.map(kc => (
                    <div key={kc.id} className="relative group">
                      <button onClick={() => handleKeycodeClick(kc.code)}
                        className="min-w-[48px] px-3 py-2.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#ffb80055] text-center text-gray-300 transition-all active:scale-95 hover:border-[#666]">
                        {kc.label}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openPresetEditor(kc); }}
                        className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-[#ffb800] hover:bg-[#e6a600] rounded-full items-center justify-center text-black hidden group-hover:flex transition-all"
                        title="編集"><Pencil size={8} /></button>
                      <button onClick={() => deleteSeqPreset(kc.id)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-500 rounded-full items-center justify-center text-white hidden group-hover:flex transition-all"
                        title="削除"><X size={10} /></button>
                    </div>
                  ))}
                  {/* Save as Preset button */}
                  {pendingSeqKeys.length > 0 && (
                    <div className="w-full mt-2">
                      <button onClick={saveSeqPreset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#332200] hover:bg-[#443300] text-[#ffb800] border border-[#ffb80044] transition-all">
                        <Plus size={12} /> プリセットとして保存
                      </button>
                    </div>
                  )}
                  {/* Builder: Navigation */}
                  <div className="w-full mt-3 mb-1"><span className="text-[10px] uppercase tracking-widest text-[#ffb800] font-medium">Build Custom — Navigation</span></div>
                  {[
                    { id: 'sq_up', key_code: 'up_arrow', label: '↑' }, { id: 'sq_down', key_code: 'down_arrow', label: '↓' },
                    { id: 'sq_left', key_code: 'left_arrow', label: '←' }, { id: 'sq_right', key_code: 'right_arrow', label: '→' },
                    { id: 'sq_pgup', key_code: 'page_up', label: 'PgUp' }, { id: 'sq_pgdn', key_code: 'page_down', label: 'PgDn' },
                    { id: 'sq_home', key_code: 'home', label: 'Home' }, { id: 'sq_end', key_code: 'end', label: 'End' },
                  ].map(k => (
                    <button key={k.id} onClick={() => addKeyToSeq({ key_code: k.key_code, _label: k.label })}
                      className="min-w-[48px] px-3 py-2.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#ffb800]">
                      {k.label}
                    </button>
                  ))}
                  {/* Builder: Actions */}
                  <div className="w-full mt-3 mb-1"><span className="text-[10px] uppercase tracking-widest text-[#ffb800] font-medium">Actions</span></div>
                  {[
                    { id: 'sq_enter', key_code: 'return_or_enter', label: 'Enter' }, { id: 'sq_space', key_code: 'spacebar', label: 'Space' },
                    { id: 'sq_tab', key_code: 'tab', label: 'Tab' }, { id: 'sq_esc', key_code: 'escape', label: 'Esc' },
                    { id: 'sq_bs', key_code: 'delete_or_backspace', label: 'Back' }, { id: 'sq_del', key_code: 'delete_forward', label: 'Del' },
                    { id: 'sq_eisuu', key_code: 'japanese_eisuu', label: '英数' }, { id: 'sq_kana', key_code: 'japanese_kana', label: 'かな' },
                  ].map(k => (
                    <button key={k.id} onClick={() => addKeyToSeq({ key_code: k.key_code, _label: k.label })}
                      className="min-w-[48px] px-3 py-2.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#ffb800]">
                      {k.label}
                    </button>
                  ))}
                  {/* Builder: Letters (lowercase) */}
                  <div className="w-full mt-3 mb-1"><span className="text-[10px] uppercase tracking-widest text-[#ffb800] font-medium">Letters (lowercase)</span></div>
                  {Array.from({length: 26}, (_, i) => {
                    const ch = String.fromCharCode(97+i);
                    return (
                      <button key={`sq_${ch}`} onClick={() => addKeyToSeq({ key_code: ch, _label: ch })}
                        className="min-w-[36px] px-2 py-2 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#ffb800]">
                        {ch}
                      </button>
                    );
                  })}
                  {/* Builder: Letters (UPPERCASE) */}
                  <div className="w-full mt-3 mb-1"><span className="text-[10px] uppercase tracking-widest text-[#ffb800] font-medium">Letters (UPPERCASE)</span></div>
                  {Array.from({length: 26}, (_, i) => {
                    const ch = String.fromCharCode(97+i);
                    const CH = String.fromCharCode(65+i);
                    return (
                      <button key={`sq_${CH}`} onClick={() => addKeyToSeq({ key_code: ch, modifiers: ['left_shift'], _label: CH })}
                        className="min-w-[36px] px-2 py-2 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-bold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#ffb800]">
                        {CH}
                      </button>
                    );
                  })}
                  {/* Builder: Numbers */}
                  <div className="w-full mt-3 mb-1"><span className="text-[10px] uppercase tracking-widest text-[#ffb800] font-medium">Numbers</span></div>
                  {Array.from({length: 10}, (_, i) => (
                    <button key={`sq_n${i}`} onClick={() => addKeyToSeq({ key_code: `keypad_${i}`, _label: `${i}` })}
                      className="min-w-[36px] px-2 py-2 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#ffb800]">
                      {i}
                    </button>
                  ))}
                  {/* Builder: Symbols */}
                  <div className="w-full mt-3 mb-1"><span className="text-[10px] uppercase tracking-widest text-[#ffb800] font-medium">Symbols</span></div>
                  {[
                    { id: 'sq_comma', key_code: 'comma', label: ',' }, { id: 'sq_period', key_code: 'period', label: '.' },
                    { id: 'sq_slash', key_code: 'slash', label: '/' }, { id: 'sq_hyphen', key_code: 'hyphen', label: '-' },
                    { id: 'sq_semicol', key_code: 'semicolon', label: ';' }, { id: 'sq_quote', key_code: 'quote', label: '\'' },
                  ].map(k => (
                    <button key={k.id} onClick={() => addKeyToSeq({ key_code: k.key_code, _label: k.label })}
                      className="min-w-[36px] px-2 py-2 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border border-[#444] text-center text-gray-300 transition-all active:scale-95 hover:border-[#ffb800]">
                      {k.label}
                    </button>
                  ))}
                </>
              ) : (
                keycodes[activeTab].map((kc, idx) => {
                  if (kc.section) {
                    return (
                      <div key={kc.id} className="w-full mt-2 mb-1 first:mt-0">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">{kc.section}</span>
                      </div>
                    );
                  }
                  const isComplex = typeof kc.code === 'object';
                  const borderColor = isComplex
                    ? kc.code.type === 'combo' ? 'border-[#00d8ff55]' : kc.code.type === 'sequence' ? 'border-[#ffb80055]' : kc.code.type === 'consumer' ? 'border-[#00ff8855]' : 'border-[#b388ff55]'
                    : 'border-[#444]';
                  return (
                    <button key={kc.id || kc.code || idx} onClick={() => handleKeycodeClick(kc.code)}
                      className={`min-w-[48px] px-3 py-2.5 bg-[#2c2c2e] hover:bg-[#4a4a4c] hover:text-white hover:-translate-y-0.5 rounded-md shadow text-xs font-semibold border ${borderColor} text-center text-gray-300 transition-all active:scale-95 hover:border-[#666]`}
                      title={typeof kc.code === 'string' ? kc.code : kc.code?.label || ''}>
                      {kc.label}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
