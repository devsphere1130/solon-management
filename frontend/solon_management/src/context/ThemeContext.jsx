import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { darkModeOverrides, defaultPreset, themeColorKeys, themePresets } from '../theme/presets.js'

const STORAGE_KEY = 'devsphere_theme'

const ThemeContext = createContext(null)

function toCssVarName(key) {
  return `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
}

function readStoredTheme() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function ThemeProvider({ children }) {
  const stored = readStoredTheme()
  const [presetId, setPresetId] = useState(stored?.presetId ?? defaultPreset.id)
  const [colors, setColors] = useState(stored?.colors ?? defaultPreset.colors)
  const [mode, setModeState] = useState(stored?.mode ?? 'light')

  useEffect(() => {
    const effectiveColors = mode === 'dark' ? { ...colors, ...darkModeOverrides } : colors

    themeColorKeys.forEach((key) => {
      document.documentElement.style.setProperty(toCssVarName(key), effectiveColors[key])
    })
    document.documentElement.style.colorScheme = mode

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ presetId, colors, mode }))
  }, [colors, mode, presetId])

  const setPreset = useCallback((id) => {
    const preset = themePresets.find((item) => item.id === id) ?? defaultPreset
    setPresetId(preset.id)
    setColors(preset.colors)
  }, [])

  const setColor = useCallback((key, value) => {
    setPresetId('custom')
    setColors((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode)
  }, [])

  const resetTheme = useCallback(() => {
    setPresetId(defaultPreset.id)
    setColors(defaultPreset.colors)
    setModeState('light')
  }, [])

  const value = useMemo(
    () => ({ presetId, colors, mode, setPreset, setColor, setMode, resetTheme }),
    [presetId, colors, mode, setPreset, setColor, setMode, resetTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
