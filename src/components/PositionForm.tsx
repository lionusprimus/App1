import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ASSET_TYPES, newId, parseNumber, type AssetType, type Position } from '../lib/portfolio'

interface Props {
  initial: Position | null
  onSave: (p: Position) => void
  onDelete: (p: Position) => void
  onClose: () => void
}

const toInput = (n: number | undefined) => (n === undefined ? '' : String(n).replace('.', ','))

export function PositionForm({ initial, onSave, onDelete, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(initial?.name ?? '')
  const [ticker, setTicker] = useState(initial?.ticker ?? '')
  const [type, setType] = useState<AssetType>(initial?.type ?? 'aktie')
  const [quantity, setQuantity] = useState(toInput(initial?.quantity))
  const [buyPrice, setBuyPrice] = useState(toInput(initial?.buyPrice))
  const [currentPrice, setCurrentPrice] = useState(toInput(initial?.currentPrice))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const d = dialogRef.current
    if (d && !d.open) d.showModal()
  }, [])

  function submit(e: FormEvent) {
    e.preventDefault()
    const q = parseNumber(quantity)
    const bp = parseNumber(buyPrice)
    const cp = currentPrice.trim() ? parseNumber(currentPrice) : bp
    if (!name.trim()) return setError('Bitte einen Namen eingeben.')
    if (!(q > 0)) return setError('Die Anzahl muss größer als 0 sein.')
    if (!(bp >= 0)) return setError('Bitte einen gültigen Kaufkurs eingeben.')
    if (!(cp >= 0)) return setError('Bitte einen gültigen aktuellen Kurs eingeben.')
    onSave({
      id: initial?.id ?? newId(),
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      type,
      quantity: q,
      buyPrice: bp,
      currentPrice: cp,
      updatedAt: cp !== initial?.currentPrice ? new Date().toISOString() : initial.updatedAt,
    })
  }

  return (
    <dialog ref={dialogRef} className="dialog" onClose={onClose} onCancel={onClose}>
      <form onSubmit={submit} noValidate>
        <header className="dialog-head">
          <h2>{initial ? 'Position bearbeiten' : 'Neue Position'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Schließen">
            ×
          </button>
        </header>

        <div className="grid-2">
          <label className="field span-2">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. MSCI World ETF" autoFocus />
          </label>
          <label className="field">
            <span>Kürzel</span>
            <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="IWDA" />
          </label>
          <label className="field">
            <span>Art</span>
            <select value={type} onChange={(e) => setType(e.target.value as AssetType)}>
              {ASSET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Anzahl</span>
            <input inputMode="decimal" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="10" />
          </label>
          <label className="field">
            <span>Kaufkurs (€)</span>
            <input inputMode="decimal" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="85,50" />
          </label>
          <label className="field span-2">
            <span>Aktueller Kurs (€)</span>
            <input
              inputMode="decimal"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="leer = Kaufkurs"
            />
          </label>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <footer className="dialog-foot">
          {initial && (
            <button type="button" className="btn danger-ghost" onClick={() => onDelete(initial)}>
              Löschen
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn ghost" onClick={onClose}>
            Abbrechen
          </button>
          <button type="submit" className="btn primary">
            Speichern
          </button>
        </footer>
      </form>
    </dialog>
  )
}
