import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { fmtEur, fmtPct } from '../lib/portfolio'

export interface Slice {
  key: string
  label: string
  value: number
}

const COLORS = ['#c8f560', '#5ec8f5', '#f5a35e', '#b48cf5', '#f56e8c', '#5ef5b4', '#f5e15e', '#8ca0b4']

export function AllocationChart({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  if (total <= 0) return <p className="muted">Noch keine Daten.</p>

  return (
    <div className="alloc">
      <div className="alloc-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((s, i) => (
                <Cell key={s.key} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => fmtEur(Number(v))}
              contentStyle={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text)',
              }}
              itemStyle={{ color: 'var(--text)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="legend">
        {slices.map((s, i) => (
          <li key={s.key}>
            <span className="swatch" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="legend-label">{s.label}</span>
            <span className="legend-val">{fmtPct((s.value / total) * 100).replace('+', '')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
