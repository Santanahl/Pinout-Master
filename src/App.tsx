// @ts-nocheck
import { useState, useEffect, useMemo } from 'react'

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
      { id: '−', signal: 'Negative', color: 'Red', colorHex: '#EF4444', description: 'Alumel (Ni-Al alloy, ~95% Ni / 2% Mn / 2% Al)' },
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
      { id: '−', signal: 'Negative', color: 'Red', colorHex: '#EF4444', description: 'Constantan (Cu-Ni alloy)' },
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
      { id: '−', signal: 'Negative', color: 'Red', colorHex: '#EF4444', description: 'Constantan (Cu-Ni alloy)' },
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
      { id: '−', signal: 'Negative', color: 'Red', colorHex: '#EF4444', description: 'Constantan (Cu-Ni alloy)' },
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
      { id: '−', signal: 'Negative', color: 'Red', colorHex: '#EF4444', description: 'Nisil (Ni-Si alloy)' },
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
      { id: '1', signal: 'Red (R)', color: '', colorHex: '', description: 'Red video signal' },
      { id: '2', signal: 'Green (G)', color: '', colorHex: '', description: 'Green video or sync-on-green (Gs)' },
      { id: '3', signal: 'Blue (B)', color: '', colorHex: '', description: 'Blue video signal' },
      { id: '4', signal: 'Composite Sync (S)', color: '', colorHex: '', description: 'Horizontal or composite sync (H/S)' },
      { id: '5', signal: 'Vertical Sync (V)', color: '', colorHex: '', description: 'Vertical sync or mode select' },
      { id: '6', signal: 'Red Return', color: '', colorHex: '', description: 'Red signal ground' },
      { id: '7', signal: 'Green Return', color: '', colorHex: '', description: 'Green signal ground' },
      { id: '8', signal: 'Blue Return', color: '', colorHex: '', description: 'Blue signal ground' },
      { id: '9', signal: 'Sync Ground', color: '', colorHex: '', description: 'Sync signal ground' },
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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

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
      </div>
    </button>
  )
}

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

          {/* Basic Info */}
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

          {/* Connector Face Image */}
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

          {/* Pins */}
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
