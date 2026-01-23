import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'
export type Contrast = 'normal' | 'high' | 'maximum'
export type FontSize = 'small' | 'normal' | 'large' | 'extra'

export interface AccessibilitySettings {
  theme: Theme
  contrast: Contrast
  fontSize: FontSize
  reduceMotion: boolean
  focusIndicators: boolean
  screenReaderOptimized: boolean
}

const defaultSettings: AccessibilitySettings = {
  theme: 'light',      // Padrão: Modo Claro
  contrast: 'normal',  // Padrão: Contraste Normal
  fontSize: 'normal',  // Padrão: Fonte Normal
  reduceMotion: false,
  focusIndicators: false,
  screenReaderOptimized: false,
}

// Load settings from localStorage
const loadSettings = (): AccessibilitySettings => {
  if (typeof window === 'undefined') return { ...defaultSettings }
  
  const saved = localStorage.getItem('accessibility-settings')
  if (saved) {
    try {
      return { ...defaultSettings, ...JSON.parse(saved) }
    } catch {
      return { ...defaultSettings }
    }
  }
  return { ...defaultSettings }
}

// Global reactive state - initialized immediately
const settings = ref<AccessibilitySettings>(loadSettings())

// Apply theme
const applyTheme = () => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  console.log('🎨 Applying theme:', settings.value.theme)
  
  if (settings.value.theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    console.log('  → Auto mode, system prefers dark:', prefersDark)
  } else {
    const isDark = settings.value.theme === 'dark'
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    console.log('  → Manual mode, dark:', isDark)
  }
  
  console.log('  → HTML classes:', root.className)
}

// Apply contrast
const applyContrast = () => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  // Remove all contrast classes first
  root.classList.remove('contrast-normal', 'contrast-high', 'contrast-maximum')
  
  // Add the selected contrast class
  root.classList.add(`contrast-${settings.value.contrast}`)
  
  console.log('🎨 Applying contrast:', settings.value.contrast)
  console.log('  → HTML classes:', root.className)
  console.log('  → Filter applied:', window.getComputedStyle(root).filter)
}

// Apply font size
const applyFontSize = () => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  const fontSizeMap: Record<FontSize, string> = {
    small: '14px',
    normal: '16px',
    large: '18px',
    extra: '20px',
  }
  root.style.fontSize = fontSizeMap[settings.value.fontSize]
  
  console.log('🎨 Applying font size:', settings.value.fontSize, '→', fontSizeMap[settings.value.fontSize])
}

// Apply reduce motion
const applyReduceMotion = () => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  if (settings.value.reduceMotion) {
    root.classList.add('reduce-motion')
  } else {
    root.classList.remove('reduce-motion')
  }
}

// Apply focus indicators
const applyFocusIndicators = () => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  if (settings.value.focusIndicators) {
    root.classList.add('enhanced-focus')
  } else {
    root.classList.remove('enhanced-focus')
  }
}

// Apply screen reader optimization
const applyScreenReaderOptimized = () => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  if (settings.value.screenReaderOptimized) {
    root.classList.add('screen-reader-optimized')
  } else {
    root.classList.remove('screen-reader-optimized')
  }
}

// Apply all settings
const applySettings = () => {
  applyTheme()
  applyContrast()
  applyFontSize()
  applyReduceMotion()
  applyFocusIndicators()
  applyScreenReaderOptimized()
}

// Save settings to localStorage
const saveSettings = () => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('accessibility-settings', JSON.stringify(settings.value))
  applySettings()
}

export const useAccessibility = () => {
  // Apply settings on first call
  if (typeof window !== 'undefined') {
    applySettings()
  }

  const setTheme = (theme: Theme) => {
    settings.value.theme = theme
    saveSettings()
  }

  const setContrast = (contrast: Contrast) => {
    settings.value.contrast = contrast
    saveSettings()
  }

  const setFontSize = (fontSize: FontSize) => {
    settings.value.fontSize = fontSize
    saveSettings()
  }

  const setReduceMotion = (value: boolean) => {
    settings.value.reduceMotion = value
    saveSettings()
  }

  const setFocusIndicators = (value: boolean) => {
    settings.value.focusIndicators = value
    saveSettings()
  }

  const setScreenReaderOptimized = (value: boolean) => {
    settings.value.screenReaderOptimized = value
    saveSettings()
  }

  const resetToDefaults = () => {
    settings.value = { ...defaultSettings }
    saveSettings()
  }

  return {
    settings,
    setTheme,
    setContrast,
    setFontSize,
    setReduceMotion,
    setFocusIndicators,
    setScreenReaderOptimized,
    saveSettings,
    resetToDefaults,
  }
}

// Initialize settings on module load
if (typeof window !== 'undefined') {
  // Apply settings immediately
  applySettings()
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settings.value.theme === 'auto') {
      applyTheme()
    }
  })
  
  // Watch for changes
  watch(() => settings.value.theme, applyTheme)
  watch(() => settings.value.contrast, applyContrast)
  watch(() => settings.value.fontSize, applyFontSize)
  watch(() => settings.value.reduceMotion, applyReduceMotion)
  watch(() => settings.value.focusIndicators, applyFocusIndicators)
  watch(() => settings.value.screenReaderOptimized, applyScreenReaderOptimized)
}
