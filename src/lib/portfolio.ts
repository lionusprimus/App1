export type AssetType = 'aktie' | 'etf' | 'krypto' | 'anleihe' | 'sonstiges'

export const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'aktie', label: 'Aktie' },
  { value: 'etf', label: 'ETF' },
  { value: 'krypto', label: 'Krypto' },
  { value: 'anleihe', label: 'Anleihe' },
  { value: 'sonstiges', label: 'Sonstiges' },
]

export function typeLabel(t: AssetType): string {
  return ASSET_TYPES.find((a) => a.value === t)?.label ?? t
}

export interface Position {
  id: string
  name: string
  ticker: string
  type: AssetType
  quantity: number
  buyPrice: number
  currentPrice: number
  updatedAt: string
}

export interface PositionStats {
  invested: number
  value: number
  gain: number
  gainPct: number
}

export function statsFor(p: Position): PositionStats {
  const invested = p.quantity * p.buyPrice
  const value = p.quantity * p.currentPrice
  const gain = value - invested
  return { invested, value, gain, gainPct: invested > 0 ? (gain / invested) * 100 : 0 }
}

export function totals(positions: Position[]): PositionStats {
  let invested = 0
  let value = 0
  for (const p of positions) {
    const s = statsFor(p)
    invested += s.invested
    value += s.value
  }
  const gain = value - invested
  return { invested, value, gain, gainPct: invested > 0 ? (gain / invested) * 100 : 0 }
}

const STORAGE_KEY = 'folio.positions.v1'

export function loadPositions(): Position[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return parsePositions(JSON.parse(raw))
  } catch {
    return null
  }
}

export function savePositions(positions: Position[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch {
    /* Speicher nicht verfügbar – App läuft trotzdem weiter */
  }
}

/** Prüft importierte Daten und verwirft ungültige Einträge. */
export function parsePositions(data: unknown): Position[] {
  if (!Array.isArray(data)) throw new Error('Ungültiges Format: Liste erwartet')
  const types = new Set(ASSET_TYPES.map((t) => t.value))
  return data
    .filter((d): d is Record<string, unknown> => typeof d === 'object' && d !== null)
    .map((d) => ({
      id: typeof d.id === 'string' ? d.id : newId(),
      name: String(d.name ?? '').trim(),
      ticker: String(d.ticker ?? '').trim().toUpperCase(),
      type: types.has(d.type as AssetType) ? (d.type as AssetType) : 'sonstiges',
      quantity: Number(d.quantity),
      buyPrice: Number(d.buyPrice),
      currentPrice: Number(d.currentPrice ?? d.buyPrice),
      updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
    }))
    .filter(
      (p) =>
        p.name.length > 0 &&
        Number.isFinite(p.quantity) &&
        Number.isFinite(p.buyPrice) &&
        Number.isFinite(p.currentPrice),
    )
}

export function newId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
}

export const SAMPLE_POSITIONS: Position[] = [
  { id: 's1', name: 'MSCI World ETF', ticker: 'IWDA', type: 'etf', quantity: 42, buyPrice: 78.4, currentPrice: 101.2, updatedAt: '2026-11-15T00:00:00.000Z' },
  { id: 's2', name: 'Apple', ticker: 'AAPL', type: 'aktie', quantity: 12, buyPrice: 162.5, currentPrice: 214.8, updatedAt: '2026-11-15T00:00:00.000Z' },
  { id: 's3', name: 'SAP', ticker: 'SAP', type: 'aktie', quantity: 8, buyPrice: 238, currentPrice: 221.4, updatedAt: '2026-11-15T00:00:00.000Z' },
  { id: 's4', name: 'Bitcoin', ticker: 'BTC', type: 'krypto', quantity: 0.035, buyPrice: 52000, currentPrice: 81500, updatedAt: '2026-11-15T00:00:00.000Z' },
  { id: 's5', name: 'Bundesanleihe 2030', ticker: 'DE30', type: 'anleihe', quantity: 10, buyPrice: 98.1, currentPrice: 99.3, updatedAt: '2026-11-15T00:00:00.000Z' },
]

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
const pct = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'exceptZero' })
const qty = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 8 })

export const fmtEur = (n: number) => eur.format(n)
export const fmtSignedEur = (n: number) => (n > 0 ? '+' : '') + eur.format(n)
export const fmtPct = (n: number) => pct.format(n) + ' %'
export const fmtQty = (n: number) => qty.format(n)

/** Akzeptiert "1.234,56" und "1234.56". */
export function parseNumber(input: string): number {
  const s = input.trim().replace(/\s/g, '')
  if (!s) return NaN
  if (s.includes(',')) return Number(s.replace(/\./g, '').replace(',', '.'))
  return Number(s)
}
