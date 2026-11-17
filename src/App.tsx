import { useEffect, useMemo, useRef, useState } from 'react'
import { AllocationChart, type Slice } from './components/AllocationChart'
import { PositionForm } from './components/PositionForm'
import {
  ASSET_TYPES,
  SAMPLE_POSITIONS,
  fmtEur,
  fmtPct,
  fmtQty,
  fmtSignedEur,
  loadPositions,
  parseNumber,
  parsePositions,
  savePositions,
  statsFor,
  totals,
  typeLabel,
  type AssetType,
  type Position,
} from './lib/portfolio'

type SortKey = 'name' | 'value' | 'gain' | 'gainPct'
type Grouping = 'type' | 'position'

const tone = (n: number) => (n > 0 ? 'pos' : n < 0 ? 'neg' : '')

export default function App() {
  const [positions, setPositions] = useState<Position[]>(() => loadPositions() ?? SAMPLE_POSITIONS)
  const [editing, setEditing] = useState<Position | null | undefined>(undefined)
  const [filter, setFilter] = useState<AssetType | 'alle'>('alle')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'value', dir: -1 })
  const [grouping, setGrouping] = useState<Grouping>('type')
  const [toast, setToast] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => savePositions(positions), [positions])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const sum = useMemo(() => totals(positions), [positions])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return positions
      .filter((p) => filter === 'alle' || p.type === filter)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.ticker.toLowerCase().includes(q))
      .map((p) => ({ p, s: statsFor(p) }))
      .sort((a, b) => {
        const d =
          sort.key === 'name' ? a.p.name.localeCompare(b.p.name, 'de') : a.s[sort.key] - b.s[sort.key]
        return d * sort.dir
      })
  }, [positions, filter, query, sort])

  const slices: Slice[] = useMemo(() => {
    if (grouping === 'position') {
      return positions
        .map((p) => ({ key: p.id, label: p.ticker || p.name, value: statsFor(p).value }))
        .filter((s) => s.value > 0)
        .sort((a, b) => b.value - a.value)
    }
    return ASSET_TYPES.map((t) => ({
      key: t.value,
      label: t.label,
      value: positions.filter((p) => p.type === t.value).reduce((s, p) => s + statsFor(p).value, 0),
    }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [positions, grouping])

  const best = useMemo(() => {
    const withGain = positions.filter((p) => p.buyPrice > 0)
    if (!withGain.length) return null
    const sorted = [...withGain].sort((a, b) => statsFor(b).gainPct - statsFor(a).gainPct)
    return { top: sorted[0], flop: sorted[sorted.length - 1] }
  }, [positions])

  function upsert(p: Position) {
    setPositions((prev) => (prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p]))
    setEditing(undefined)
    setToast(editing ? 'Position aktualisiert' : 'Position hinzugefügt')
  }

  function remove(p: Position) {
    if (!confirm(`„${p.name}“ wirklich löschen?`)) return
    setPositions((prev) => prev.filter((x) => x.id !== p.id))
    setToast('Position gelöscht')
  }

  function updatePrice(p: Position, raw: string) {
    const n = parseNumber(raw)
    if (!Number.isFinite(n) || n < 0 || n === p.currentPrice) return
    setPositions((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, currentPrice: n, updatedAt: new Date().toISOString() } : x)),
    )
  }

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === 'name' ? 1 : -1 }))
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(positions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `folio-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importJson(file: File) {
    try {
      const data = parsePositions(JSON.parse(await file.text()))
      if (!data.length) throw new Error('Keine gültigen Positionen gefunden')
      if (!confirm(`${data.length} Positionen importieren? Die aktuellen Daten werden ersetzt.`)) return
      setPositions(data)
      setToast(`${data.length} Positionen importiert`)
    } catch (e) {
      setToast(`Import fehlgeschlagen: ${e instanceof Error ? e.message : 'unbekannter Fehler'}`)
    }
  }

  const arrow = (k: SortKey) => (sort.key === k ? (sort.dir === 1 ? ' ↑' : ' ↓') : '')

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">F</span>
          <span>Folio</span>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={exportJson} disabled={!positions.length}>
            Export
          </button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importJson(f)
              e.target.value = ''
            }}
          />
          <button className="btn primary" onClick={() => setEditing(null)}>
            + Position
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">Gesamtwert</p>
          <h1 className="hero-value">{fmtEur(sum.value)}</h1>
          <p className={`hero-delta ${tone(sum.gain)}`}>
            {fmtSignedEur(sum.gain)} <span>({fmtPct(sum.gainPct)})</span>
          </p>
        </section>

        <section className="cards">
          <div className="card stat">
            <p className="muted">Investiert</p>
            <p className="stat-val">{fmtEur(sum.invested)}</p>
          </div>
          <div className="card stat">
            <p className="muted">Positionen</p>
            <p className="stat-val">{positions.length}</p>
          </div>
          <div className="card stat">
            <p className="muted">Bester Wert</p>
            <p className="stat-val small">
              {best ? (
                <>
                  {best.top.ticker || best.top.name}{' '}
                  <span className={tone(statsFor(best.top).gainPct)}>{fmtPct(statsFor(best.top).gainPct)}</span>
                </>
              ) : (
                '–'
              )}
            </p>
          </div>
          <div className="card stat">
            <p className="muted">Schwächster Wert</p>
            <p className="stat-val small">
              {best ? (
                <>
                  {best.flop.ticker || best.flop.name}{' '}
                  <span className={tone(statsFor(best.flop).gainPct)}>{fmtPct(statsFor(best.flop).gainPct)}</span>
                </>
              ) : (
                '–'
              )}
            </p>
          </div>
        </section>

        <div className="layout">
          <section className="card">
            <div className="card-head">
              <h2>Positionen</h2>
              <div className="filters">
                <input
                  className="search"
                  type="search"
                  placeholder="Suchen…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Positionen durchsuchen"
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value as AssetType | 'alle')} aria-label="Nach Art filtern">
                  <option value="alle">Alle Arten</option>
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {positions.length === 0 ? (
              <div className="empty">
                <p>Dein Portfolio ist noch leer.</p>
                <div className="empty-actions">
                  <button className="btn primary" onClick={() => setEditing(null)}>
                    Erste Position anlegen
                  </button>
                  <button className="btn ghost" onClick={() => setPositions(SAMPLE_POSITIONS)}>
                    Beispieldaten laden
                  </button>
                </div>
              </div>
            ) : visible.length === 0 ? (
              <p className="muted pad">Keine Treffer.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <button className="th-btn" onClick={() => toggleSort('name')}>
                          Name{arrow('name')}
                        </button>
                      </th>
                      <th className="num hide-sm">Anzahl</th>
                      <th className="num hide-sm">Kaufkurs</th>
                      <th className="num">Kurs</th>
                      <th className="num">
                        <button className="th-btn" onClick={() => toggleSort('value')}>
                          Wert{arrow('value')}
                        </button>
                      </th>
                      <th className="num hide-sm">
                        <button className="th-btn" onClick={() => toggleSort('gainPct')}>
                          G/V{arrow('gainPct')}
                        </button>
                      </th>
                      <th className="hide-sm" aria-label="Aktionen" />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(({ p, s }) => (
                      <tr key={p.id}>
                        <td>
                          <button className="name name-btn" onClick={() => setEditing(p)}>
                            {p.name}
                          </button>
                          <div className="sub">
                            {p.ticker && <span className="ticker">{p.ticker}</span>}
                            <span className={`badge t-${p.type}`}>{typeLabel(p.type)}</span>
                          </div>
                        </td>
                        <td className="num hide-sm">{fmtQty(p.quantity)}</td>
                        <td className="num hide-sm">{fmtEur(p.buyPrice)}</td>
                        <td className="num">
                          <input
                            key={`${p.id}-${p.currentPrice}`}
                            className="price-input"
                            inputMode="decimal"
                            defaultValue={String(p.currentPrice).replace('.', ',')}
                            aria-label={`Aktueller Kurs ${p.name}`}
                            title={`Zuletzt aktualisiert: ${new Date(p.updatedAt).toLocaleString('de-DE')}`}
                            onBlur={(e) => updatePrice(p, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.currentTarget.blur()
                            }}
                          />
                        </td>
                        <td className="num">
                          <div className="strong">{fmtEur(s.value)}</div>
                          <div className={`sub-num show-sm ${tone(s.gain)}`}>{fmtPct(s.gainPct)}</div>
                        </td>
                        <td className={`num hide-sm ${tone(s.gain)}`}>
                          <div>{fmtPct(s.gainPct)}</div>
                          <div className="sub-num">{fmtSignedEur(s.gain)}</div>
                        </td>
                        <td className="row-actions hide-sm">
                          <button className="icon-btn" onClick={() => setEditing(p)} aria-label={`${p.name} bearbeiten`} title="Bearbeiten">
                            ✎
                          </button>
                          <button className="icon-btn danger" onClick={() => remove(p)} aria-label={`${p.name} löschen`} title="Löschen">
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="card">
            <div className="card-head">
              <h2>Aufteilung</h2>
              <div className="seg" role="tablist">
                <button role="tab" aria-selected={grouping === 'type'} onClick={() => setGrouping('type')}>
                  Art
                </button>
                <button role="tab" aria-selected={grouping === 'position'} onClick={() => setGrouping('position')}>
                  Position
                </button>
              </div>
            </div>
            <AllocationChart slices={slices} />
          </aside>
        </div>

        <p className="footnote">
          Kurse werden manuell gepflegt: Klicke in der Tabelle auf einen Kurs, um ihn zu ändern. Alle Daten bleiben lokal in
          deinem Browser.
        </p>
      </main>

      {editing !== undefined && (
        <PositionForm
          initial={editing}
          onSave={upsert}
          onDelete={(p) => {
            setEditing(undefined)
            remove(p)
          }}
          onClose={() => setEditing(undefined)}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
