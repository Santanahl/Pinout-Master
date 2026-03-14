// @ts-nocheck
import { useState, useEffect, useMemo } from 'react'

// ================================================================
// DEFAULT CONNECTOR DATABASE
// ================================================================
const DEFAULT_CONNECTORS = [
  {
    id: 'k-type-tc',
    name: 'K-Type Thermocouple',
    category: 'Thermocouples',
    description: 'Most common general-purpose TC. Range: −200°C to +1350°C',
    standard: 'ANSI MC96.1 / IEC 60584',
    connectorType: 'Miniature TC Connector / Extension Wire',
    imageUrl: '',
    pins: [
      { id: '+', signal: 'Positive', color: 'Yellow', colorHex: '#EAB308', description: 'Chromel (Ni-Cr alloy, ~90% Ni / 10% Cr)' },
      { id: '−', signal: 'Negative', color: 'Red',    colorHex: '#EF4444', description: 'Alumel (Ni-Al alloy, ~95% Ni / 2% Mn / 2% Al)' },
    ],
    notes: 'ANSI: Yellow(+), Red(−). IEC 60584: Green(+), White(−). Red is ALWAYS negative for ANSI TCs.',
    userAdded: false,
  },
  {
    id: 'j-type-tc',
    name: 'J-Type Thermocouple',
    category: 'Thermocouples',
    description: 'Common in older equipment. Range: 0°C to +750°C',
    standard: 'ANSI MC96.1 / IEC 60584',
    connectorType: 'Miniature TC Connector / Extension Wire',
    imageUrl: '',
    pins: [
      { id: '+', signal: 'Positive', color: 'White', colorHex: '#E5E7EB', description: 'Iron (Fe)' },
      { id: '−', signal: 'Negative', color: 'Red',   colorHex: '#EF4444', description: 'Constantan (Cu-Ni alloy)' },
    ],
    notes: 'ANSI: White(+), Red(−). IEC 60584: Black(+), White(−).',
    userAdded: false,
  },
  {
    id: 't-type-tc',
    name: 'T-Type Thermocouple',
    category: 'Thermocouples',
    description: 'Excellent for cryogenic use. Range: −270°C to +400°C',
    standard: 'ANSI MC96.1 / IEC 60584',
    connectorType: 'Miniature TC Connector / Extension Wire',
    imageUrl: '',
    pins: [
      { id: '+', signal: 'Positive', color: 'Blue', colorHex: '#3B82F6', description: 'Copper (Cu)' },
      { id: '−', signal: 'Negative', color: 'Red',  colorHex: '#EF4444', description: 'Constantan (Cu-Ni alloy)' },
    ],
    notes: 'ANSI: Blue(+), Red(−). IEC 60584: Brown(+), White(−).',
    userAdded: false,
  },
  {
    id: 'e-type-tc',
    name: 'E-Type Thermocouple',
    category: 'Thermocouples',
    description: 'Highest EMF output per degree. Range: −270°C to +1000°C',
    standard: 'ANSI MC96.1 / IEC 60584',
    connectorType: 'Miniature TC Connector / Extension Wire',
    imageUrl: '',
    pins: [
      { id: '+', signal: 'Positive', color: 'Purple', colorHex: '#A855F7', description: 'Chromel (Ni-Cr alloy)' },
      { id: '−', signal: 'Negative', color: 'Red',    colorHex: '#EF4444', description: 'Constantan (Cu-Ni alloy)' },
    ],
    notes: 'ANSI: Purple(+), Red(−). IEC 60584: Violet(+), White(−).',
    userAdded: false,
  },
  {
    id: 'n-type-tc',
    name: 'N-Type Thermocouple',
    category: 'Thermocouples',
    description: 'High accuracy & stability. Range: −270°C to +1300°C',
    standard: 'ANSI MC96.1 / IEC 60584',
    connectorType: 'Miniature TC Connector / Extension Wire',
    imageUrl: '',
    pins: [
      { id: '+', signal: 'Positive', color: 'Orange', colorHex: '#F97316', description: 'Nicrosil (Ni-Cr-Si alloy)' },
      { id: '−', signal: 'Negative', color: 'Red',    colorHex: '#EF4444', description: 'Nisil (Ni-Si alloy)' },
    ],
    notes: 'ANSI: Orange(+), Red(−). IEC 60584: Pink(+), White(−).',
    userAdded: false,
  },
  {
    id: 'vga-de9',
    name: 'PGC / VGA DE-9',
    category: 'Video',
    description: '9-pin analog video connector used in PGC and early VGA systems',
    standard: 'VESA / IBM PGC',
    connectorType: 'DE-9 D-subminiature',
    imageUrl: '',
    pins: [
      { id: '1', signal: 'Red (R)',           color: '', colorHex: '', description: 'Red video signal' },
      { id: '2', signal: 'Green (G)',          color: '', colorHex: '', description: 'Green video or sync-on-green (Gs)' },
      { id: '3', signal: 'Blue (B)',           color: '', colorHex: '', description: 'Blue video signal' },
      { id: '4', signal: 'Composite Sync (S)', color: '', colorHex: '', description: 'Horizontal or composite sync (H/S)' },
      { id: '5', signal: 'Vertical Sync (V)',  color: '', colorHex: '', description: 'Vertical sync or mode select' },
      { id: '6', signal: 'Red Return',         color: '', colorHex: '', description: 'Red signal ground' },
      { id: '7', signal: 'Green Return',       color: '', colorHex: '', description: 'Green signal ground' },
      { id: '8', signal: 'Blue Return',        color: '', colorHex: '', description: 'Blue signal ground' },
      { id: '9', signal: 'Sync Ground',        color: '', colorHex: '', description: 'Sync signal ground' },
    ],
    notes: 'Pin 4 is composite sync (PGC) or H/composite (VGA). Pin 5 is mode select (PGC) or V-sync (VGA).',
    userAdded: false,
  },
  {
    id: 'vga-de15',
    name: 'VGA DE-15 Connector',
    category: 'Video',
    description: 'Standard 15-pin VGA connector for analog video output',
    standard: 'VESA',
    connectorType: 'DE-15 / HD-15 D-subminiature',
    imageUrl: '',
    pins: [
      { id: '1',  signal: 'Red (R)',           color: '', colorHex: '', description: 'Red video (0.7V p-p, 75Ω)' },
      { id: '2',  signal: 'Green (G)',          color: '', colorHex: '', description: 'Green video or sync-on-green' },
      { id: '3',  signal: 'Blue (B)',           color: '', colorHex: '', description: 'Blue video (0.7V p-p, 75Ω)' },
      { id: '4',  signal: 'Monitor ID2',        color: '', colorHex: '', description: 'Monitor ID bit 2 / composite sync' },
      { id: '5',  signal: 'GND',               color: '', colorHex: '', description: 'Ground / vertical sync' },
      { id: '6',  signal: 'Red Return (GND)',   color: '', colorHex: '', description: 'Red signal ground' },
      { id: '7',  signal: 'Green Return (GND)', color: '', colorHex: '', description: 'Green signal ground' },
      { id: '8',  signal: 'Blue Return (GND)',  color: '', colorHex: '', description: 'Blue signal ground' },
      { id: '9',  signal: '+5V / NC',           color: '', colorHex: '', description: '+5V for DDC or no connect' },
      { id: '10', signal: 'Sync Ground',        color: '', colorHex: '', description: 'DAC / sync ground' },
      { id: '11', signal: 'Monitor ID0',        color: '', colorHex: '', description: 'Monitor ID bit 0' },
      { id: '12', signal: 'SDA (DDC)',          color: '', colorHex: '', description: 'I²C data — EDID serial data' },
      { id: '13', signal: 'HSYNC',              color: '', colorHex: '', description: 'Horizontal sync signal' },
      { id: '14', signal: 'VSYNC',              color: '', colorHex: '', description: 'Vertical sync signal' },
      { id: '15', signal: 'SCL (DDC)',          color: '', colorHex: '', description: 'I²C clock — EDID serial clock' },
    ],
    notes: 'Pins 6–10 are ground. Pins 12 & 15 used for DDC/EDID monitor identification.',
    userAdded: false,
  },
  {
    id: 'rj45-t568b',
    name: 'RJ45 Ethernet — T568B',
    category: 'Networking',
    description: '8P8C modular connector, T568B standard (most common in North America)',
    standard: 'TIA/EIA-568-B',
    connectorType: '8P8C Modular Jack',
    imageUrl: '',
    pins: [
      { id: '1', signal: 'TX+',    color: 'Orange/White', colorHex: '#FED7AA', description: 'Transmit data positive' },
      { id: '2', signal: 'TX−',    color: 'Orange',       colorHex: '#F97316', description: 'Transmit data negative' },
      { id: '3', signal: 'RX+',    color: 'Green/White',  colorHex: '#BBF7D0', description: 'Receive data positive' },
      { id: '4', signal: 'BI_D3+', color: 'Blue',         colorHex: '#3B82F6', description: 'Bidirectional pair 3+ (Gigabit)' },
      { id: '5', signal: 'BI_D3−', color: 'Blue/White',   colorHex: '#BFDBFE', description: 'Bidirectional pair 3− (Gigabit)' },
      { id: '6', signal: 'RX−',    color: 'Green',        colorHex: '#22C55E', description: 'Receive data negative' },
      { id: '7', signal: 'BI_D4+', color: 'Brown/White',  colorHex: '#D6B896', description: 'Bidirectional pair 4+ (Gigabit)' },
      { id: '8', signal: 'BI_D4−', color: 'Brown',        colorHex: '#78350F', description: 'Bidirectional pair 4− (Gigabit)' },
    ],
    notes: 'T568B: Orange=pairs 2, Green=pair 3. T568A swaps orange ↔ green. Crossover cable uses T568A on one end.',
    userAdded: false,
  },
  {
    id: 'usb-type-a',
    name: 'USB Type-A (2.0)',
    category: 'USB / Data',
    description: 'Standard USB Type-A connector, USB 2.0 pinout',
    standard: 'USB 2.0 — IEC 62680',
    connectorType: 'Type-A Plug / Receptacle',
    imageUrl: '',
    pins: [
      { id: '1', signal: 'VBUS', color: 'Red',   colorHex: '#EF4444', description: '+5V power (max 500mA @ USB 2.0)' },
      { id: '2', signal: 'D−',   color: 'White', colorHex: '#E5E7EB', description: 'Data negative' },
      { id: '3', signal: 'D+',   color: 'Green', colorHex: '#22C55E', description: 'Data positive' },
      { id: '4', signal: 'GND',  color: 'Black', colorHex: '#111827', description: 'Ground' },
    ],
    notes: 'Shell connects to chassis ground. USB 2.0: max 480 Mbps, 500mA. USB 3.0 adds 5 more pins.',
    userAdded: false,
  },
  {
    id: 'db9-rs232',
    name: 'DB9 RS-232 Serial (DTE)',
    category: 'Serial',
    description: '9-pin RS-232 serial — DTE (computer/terminal) pinout',
    standard: 'RS-232 / EIA-232',
    connectorType: 'DE-9 D-subminiature',
    imageUrl: '',
    pins: [
      { id: '1', signal: 'DCD', color: '', colorHex: '', description: 'Data Carrier Detect (input)' },
      { id: '2', signal: 'RXD', color: '', colorHex: '', description: 'Received Data (input)' },
      { id: '3', signal: 'TXD', color: '', colorHex: '', description: 'Transmitted Data (output)' },
      { id: '4', signal: 'DTR', color: '', colorHex: '', description: 'Data Terminal Ready (output)' },
      { id: '5', signal: 'GND', color: '', colorHex: '', description: 'Signal Ground' },
      { id: '6', signal: 'DSR', color: '', colorHex: '', description: 'Data Set Ready (input)' },
      { id: '7', signal: 'RTS', color: '', colorHex: '', description: 'Request to Send (output)' },
      { id: '8', signal: 'CTS', color: '', colorHex: '', description: 'Clear to Send (input)' },
      { id: '9', signal: 'RI',  color: '', colorHex: '', description: 'Ring Indicator (input)' },
    ],
    notes: 'DTE pinout. DCE (modem) swaps pins 2↔3 and 7↔8. Null modem crosses TXD/RXD and RTS/CTS.',
    userAdded: false,
  },
]

// ================================================================
// UTILITIES
// ================================================================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ================================================================
// COLOR SWATCH
// ================================================================
function ColorSwatch({ colorHex, colorName }) {
  if (!colorName) return <span className="text-gray-600 text-sm">—</span>
  return (
    <div className="flex items-center gap-2">
      {colorHex && (
        <div
          className="w-4 h-4 rounded-full border border-gray-500 flex-shrink-0"
          style={{ backgroundColor: colorHex }}
          title={colorName}
        />
      )}
      <span className="text-sm text-gray-300">{colorName}</span>
    </div>
  )
}

// ================================================================
// PIN TABLE
// ================================================================
function PinTable({ pins }) {
  const hasColors = pins.some(p => p.color)
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-700/50 border-b border-gray-700">
            <th className="text-left py-2 px-4 text-gray-400 font-medium w-16">Pin</th>
            <th className="text-left py-2 px-4 text-gray-400 font-medium">Signal</th>
            {hasColors && (
              <th className="text-left py-2 px-4 text-gray-400 font-medium w-40">Wire Color</th>
            )}
            <th className="text-left py-2 px-4 text-gray-400 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {pins.map((pin, i) => (
            <tr
              key={i}
              className="border-b border-gray-800 last:border-0 hover:bg-gray-700/30 transition-colors"
            >
              <td className="py-2.5 px-4">
                <span className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded font-mono text-xs font-bold">
                  {pin.id}
                </span>
              </td>
              <td className="py-2.5 px-4 text-white font-medium">{pin.signal}</td>
              {hasColors && (
                <td className="py-2.5 px-4">
                  <ColorSwatch colorHex={pin.colorHex} colorName={pin.color} />
                </td>
              )}
              <td className="py-2.5 px-4 text-gray-400">{pin.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ================================================================
// CONNECTOR DETAIL
// ================================================================
function ConnectorDetail({ connector, onDelete, onEdit }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-blue-900/50 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-800">
                {connector.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{connector.name}</h2>
            <p className="text-gray-400 mt-1 text-sm">{connector.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <button
              onClick={() => onEdit(connector)}
              className="text-gray-500 hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
              title="Edit connector"
            >
              ✏️ Edit
            </button>
            {connector.userAdded && (
              <button
                onClick={() => onDelete(connector.id)}
                className="text-gray-500 hover:text-red-400 transition-colors text-sm flex items-center gap-1"
                title="Delete connector"
              >
                🗑 Delete
              </button>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
          {connector.standard && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Standard</p>
              <p className="text-sm text-gray-300">{connector.standard}</p>
            </div>
          )}
          {connector.connectorType && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Connector Type</p>
              <p className="text-sm text-gray-300">{connector.connectorType}</p>
            </div>
          )}
        </div>

        {/* Connector Face Image */}
        {connector.imageUrl && (
          <div className="mt-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Connector Face
            </p>
            <img
              src={connector.imageUrl}
              alt={`${connector.name} connector face`}
              className="max-h-56 max-w-sm rounded-lg border border-gray-700 object-contain bg-gray-900 p-2"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}
      </div>

      {/* Pin Table */}
      <div className="px-6 py-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
          Pinout — {connector.pins.length} {connector.pins.length === 1 ? 'pin' : 'pins'}
        </p>
        <PinTable pins={connector.pins} />
      </div>

      {/* Notes */}
      {connector.notes && (
        <div className="px-6 py-4 border-t border-gray-700 bg-yellow-900/10">
          <p className="text-xs text-yellow-600 uppercase tracking-wider font-semibold mb-1">⚠ Notes</p>
          <p className="text-sm text-gray-300">{connector.notes}</p>
        </div>
      )}
    </div>
  )
}


// ================================================================
// CONNECTOR LIST ITEM
// ================================================================
function ConnectorListItem({ connector, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 ${
        isSelected
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
          : 'text-gray-300 hover:bg-gray-700/80 hover:text-white'
      }`}
    >
      <div className="font-medium text-sm truncate">{connector.name}</div>
      <div className={`text-xs mt-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
        {connector.pins.length} pins · {connector.category}
        {connector.userAdded && ' · Custom'}
      </div>
    </button>
  )
}

// ================================================================
// CONNECTOR FORM MODAL — handles both Add and Edit
// ================================================================
const EMPTY_PIN = () => ({ id: '', signal: '', color: '', colorHex: '#6B7280', description: '' })

function ConnectorFormModal({ onClose, onSave, existingCategories, initialData = null }) {
  const isEdit = initialData !== null

  const [form, setForm] = useState(
    initialData
      ? {
          name:          initialData.name          || '',
          category:      initialData.category      || '',
          description:   initialData.description   || '',
          standard:      initialData.standard      || '',
          connectorType: initialData.connectorType || '',
          notes:         initialData.notes         || '',
          imageUrl:      initialData.imageUrl      || '',
          pins: initialData.pins?.length
            ? initialData.pins.map(p => ({ ...p }))
            : [EMPTY_PIN()],
        }
      : {
          name: '', category: '', description: '',
          standard: '', connectorType: '', notes: '',
          imageUrl: '', pins: [EMPTY_PIN()],
        }
  )

  const [errors, setErrors]     = useState({})
  const [imgError, setImgError] = useState(false)

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
    if (field === 'imageUrl') setImgError(false)
  }

  const setPin = (i, field, value) =>
    setForm(p => {
      const pins = [...p.pins]
      pins[i] = { ...pins[i], [field]: value }
      return { ...p, pins }
    })

  const addPin    = () => setForm(p => ({ ...p, pins: [...p.pins, EMPTY_PIN()] }))
  const removePin = (i) => {
    if (form.pins.length === 1) return
    setForm(p => ({ ...p, pins: p.pins.filter((_, idx) => idx !== i) }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name = 'Name is required'
    if (!form.category.trim()) e.category = 'Category is required'
    if (form.pins.some(p => !p.id.trim() || !p.signal.trim()))
      e.pins = 'Every pin needs an ID and signal name'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => { if (validate()) onSave(form) }

  const inputCls      = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm transition-colors'
  const smallInputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs transition-colors'

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? '✏️ Edit Connector' : '✦ Add New Connector'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ── Basic Info ── */}
          <section>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Basic Information</p>
            <div className="grid grid-cols-2 gap-3">

              <div className="col-span-2">
                <label className="block text-sm text-gray-300 mb-1">
                  Connector Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. K-Type Thermocouple"
                  className={inputCls}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Category <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  placeholder="e.g. Sensors"
                  list="cat-list"
                  className={inputCls}
                />
                <datalist id="cat-list">
                  {existingCategories.map(c => <option key={c} value={c} />)}
                </datalist>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Standard</label>
                <input
                  type="text"
                  value={form.standard}
                  onChange={e => set('standard', e.target.value)}
                  placeholder="e.g. ANSI MC96.1"
                  className={inputCls}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Connector Type</label>
                <input
                  type="text"
                  value={form.connectorType}
                  onChange={e => set('connectorType', e.target.value)}
                  placeholder="e.g. DE-15 D-subminiature"
                  className={inputCls}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Brief description..."
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </section>

          {/* ── Connector Face Image ── */}
          <section>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
              Connector Face Image
            </p>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
                placeholder="https://example.com/connector-face.png"
                className={inputCls}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste a direct link to an image. Works with Imgur, GitHub raw files, or any image host.
              </p>
            </div>

            {/* Live Preview */}
            {form.imageUrl && !imgError && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1.5">Preview:</p>
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="max-h-40 max-w-xs rounded-lg border border-gray-600 object-contain bg-gray-900 p-2"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            {form.imageUrl && imgError && (
              <p className="text-red-400 text-xs mt-2">⚠ Could not load image — check the URL</p>
            )}
          </section>

          {/* ── Pins ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Pins ({form.pins.length})
              </p>
              <button
                onClick={addPin}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                + Add Pin
              </button>
            </div>

            {errors.pins && (
              <p className="text-red-400 text-xs mb-2 bg-red-900/20 border border-red-800 rounded px-2 py-1">
                {errors.pins}
              </p>
            )}

            <div className="grid grid-cols-12 gap-2 px-1 mb-1">
              <div className="col-span-2 text-xs text-gray-500">Pin ID *</div>
              <div className="col-span-3 text-xs text-gray-500">Signal *</div>
              <div className="col-span-2 text-xs text-gray-500">Color Name</div>
              <div className="col-span-1 text-xs text-gray-500 text-center">Swatch</div>
              <div className="col-span-3 text-xs text-gray-500">Description</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-2">
              {form.pins.map((pin, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={pin.id}
                      onChange={e => setPin(i, 'id', e.target.value)}
                      placeholder="1 or +"
                      className={`${smallInputCls} font-mono`}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={pin.signal}
                      onChange={e => setPin(i, 'signal', e.target.value)}
                      placeholder="VBUS"
                      className={smallInputCls}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={pin.color}
                      onChange={e => setPin(i, 'color', e.target.value)}
                      placeholder="Red"
                      className={smallInputCls}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <input
                      type="color"
                      value={pin.colorHex || '#6B7280'}
                      onChange={e => setPin(i, 'colorHex', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      title="Pick wire color"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={pin.description}
                      onChange={e => setPin(i, 'description', e.target.value)}
                      placeholder="Optional"
                      className={smallInputCls}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => removePin(i)}
                      disabled={form.pins.length === 1}
                      className="text-gray-600 hover:text-red-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-xl leading-none"
                      title="Remove pin"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Notes ── */}
          <section>
            <label className="block text-sm text-gray-300 mb-1">Notes / Warnings</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="e.g. Red is always negative for ANSI TCs..."
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-900/40"
          >
            {isEdit ? 'Save Changes' : 'Add Connector'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ================================================================
// MAIN APP
// ================================================================
export default function App() {
  const [connectors, setConnectors]         = useState(DEFAULT_CONNECTORS)
  const [selectedId, setSelectedId]         = useState(DEFAULT_CONNECTORS[0].id)
  const [search, setSearch]                 = useState('')
  const [activeCategory, setCategory]       = useState('All')
  const [showModal, setShowModal]           = useState(false)
  const [editingConnector, setEditingConnector] = useState(null)
  const [saveStatus, setSaveStatus]         = useState(null) // null | 'saving' | 'saved' | 'error'

  useEffect(() => {
    fetch('/data.json')
      .then(r => r.json())
      .then(data => {
        if (data.length > 0) {
          setConnectors(data)
          setSelectedId(data[0].id)
        }
      })
      .catch(() => {}) // falls back to DEFAULT_CONNECTORS
  }, [])

  // ── Derived ──
  const categories = useMemo(() =>
    ['All', ...new Set(connectors.map(c => c.category).sort())],
    [connectors]
  )

  const existingCategories = useMemo(() =>
    [...new Set(connectors.map(c => c.category))].sort(),
    [connectors]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return connectors.filter(c => {
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.standard?.toLowerCase().includes(q) ||
        c.pins.some(p =>
          p.signal.toLowerCase().includes(q) ||
          p.color?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        )
      const matchCat = activeCategory === 'All' || c.category === activeCategory
      return matchSearch && matchCat
    })
  }, [connectors, search, activeCategory])

  const selectedConnector = connectors.find(c => c.id === selectedId)

  // ── Shared GitHub save helper ──
  const saveToGitHub = async (updatedConnectors) => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/update-connectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectors: updatedConnectors }),
      })
      if (!res.ok) throw new Error('API error')
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Failed to save to GitHub:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  // ── Add ──
  const handleAdd = async (form) => {
    const newConnector     = { ...form, id: generateId(), userAdded: true }
    const updatedConnectors = [...connectors, newConnector]
    setConnectors(updatedConnectors)
    setSelectedId(newConnector.id)
    setShowModal(false)
    await saveToGitHub(updatedConnectors)
  }

  // ── Edit ──
  const handleEditSave = async (form) => {
    const updatedConnector  = { ...editingConnector, ...form }
    const updatedConnectors = connectors.map(c =>
      c.id === editingConnector.id ? updatedConnector : c
    )
    setConnectors(updatedConnectors)
    setEditingConnector(null)
    await saveToGitHub(updatedConnectors)
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!confirm('Delete this connector?')) return
    const updatedConnectors = connectors.filter(c => c.id !== id)
    setConnectors(updatedConnectors)
    setSelectedId(updatedConnectors[0]?.id || null)
    await saveToGitHub(updatedConnectors)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* ── Header ── */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🔌 <span>PinOut DB</span>
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Connector & Sensor Pinout Reference · {connectors.length} connectors
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-900/40"
          >
            + Add Connector
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-6 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-4 min-h-0">

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search connectors, pins..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-8 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Connector List */}
          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm">No connectors found</p>
              </div>
            ) : (
              filtered.map(c => (
                <ConnectorListItem
                  key={c.id}
                  connector={c}
                  isSelected={c.id === selectedId}
                  onClick={() => setSelectedId(c.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Main Detail Panel ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {selectedConnector ? (
            <ConnectorDetail
              connector={selectedConnector}
              onDelete={handleDelete}
              onEdit={setEditingConnector}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <p className="text-6xl mb-4">🔌</p>
              <p className="text-lg font-medium">Select a connector</p>
              <p className="text-sm">or search above</p>
            </div>
          )}
        </main>
      </div>

      {/* ── Save Status Toast ── */}
      {saveStatus && (
        <div className={`fixed bottom-5 right-5 px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl z-50 transition-all ${
          saveStatus === 'saving' ? 'bg-gray-700 text-gray-200' :
          saveStatus === 'saved'  ? 'bg-emerald-800 text-emerald-100' :
                                    'bg-red-900 text-red-200'
        }`}>
          {saveStatus === 'saving' ? '⏳ Saving to GitHub...' :
           saveStatus === 'saved'  ? '✓ Saved to GitHub' :
                                     '⚠️ Save failed — check console'}
        </div>
      )}

      {/* ── Add Modal ── */}
      {showModal && (
        <ConnectorFormModal
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
          existingCategories={existingCategories}
        />
      )}

      {/* ── Edit Modal ── */}
      {editingConnector && (
        <ConnectorFormModal
          onClose={() => setEditingConnector(null)}
          onSave={handleEditSave}
          existingCategories={existingCategories}
          initialData={editingConnector}
        />
      )}
    </div>
  )
}
