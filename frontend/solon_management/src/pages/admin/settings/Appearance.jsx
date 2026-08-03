import { Check, Moon, RotateCcw, Sun } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { themeColorKeys, themePresets } from '../../../theme/presets.js'
import Button from '../../../components/common/Button.jsx'
import Badge from '../../../components/common/Badge.jsx'
import { cn } from '../../../lib/cn.js'

const colorLabels = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  surface: 'Surface',
  card: 'Card',
  sidebar: 'Sidebar',
  navbar: 'Navbar',
  border: 'Border',
  text: 'Text',
  textMuted: 'Muted text',
}

const swatchKeys = ['primary', 'secondary', 'accent', 'sidebar']

function PresetCard({ preset, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset.id)}
      className={cn(
        'relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
        isActive ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40',
      )}
    >
      {isActive && (
        <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="size-3" aria-hidden="true" />
        </span>
      )}
      <div className="flex -space-x-1.5">
        {swatchKeys.map((key) => (
          <span
            key={key}
            className="size-6 rounded-full border-2 border-card"
            style={{ backgroundColor: preset.colors[key] }}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-text">{preset.name}</span>
    </button>
  )
}

function Appearance() {
  const { presetId, colors, mode, setPreset, setColor, setMode, resetTheme } = useTheme()

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-text">Theme presets</h2>
              <p className="mt-1 text-xs text-text-muted">Pick a starting point, then fine-tune any color below.</p>
            </div>
            <Button variant="outline" size="sm" onClick={resetTheme}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset to default
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {themePresets.map((preset) => (
              <PresetCard key={preset.id} preset={preset} isActive={presetId === preset.id} onSelect={setPreset} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-bold text-text">Appearance mode</h2>
          <div className="mt-4 inline-flex rounded-full border border-border p-1">
            <button
              type="button"
              onClick={() => setMode('light')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                mode === 'light' ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text',
              )}
            >
              <Sun className="size-4" aria-hidden="true" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                mode === 'dark' ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text',
              )}
            >
              <Moon className="size-4" aria-hidden="true" />
              Dark
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-bold text-text">Custom colors</h2>
          <p className="mt-1 text-xs text-text-muted">Changing any color switches your theme to Custom.</p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {themeColorKeys.map((key) => (
              <label key={key} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(event) => setColor(key, event.target.value)}
                  className="size-9 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                  aria-label={colorLabels[key]}
                />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-text">{colorLabels[key]}</span>
                  <span className="block truncate text-[11px] text-text-muted uppercase">{colors[key]}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-sm font-bold text-text">Live preview</h2>
        <p className="mt-1 text-xs text-text-muted">Reflects your changes instantly — no reload needed.</p>

        <div className="mt-5 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-text">Today's Appointments</span>
            <Badge variant="success">+6.1%</Badge>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-text">38</p>
          <p className="mt-1 text-xs text-text-muted">vs yesterday</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm">Primary action</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="accent">
              Accent
            </Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-sidebar p-4">
          <p className="text-xs font-semibold text-white/70">Sidebar preview</p>
          <p className="mt-1 text-sm font-bold text-white">DevSphere</p>
        </div>
      </div>
    </div>
  )
}

export default Appearance
