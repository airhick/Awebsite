import { create } from 'zustand'

export interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
]

// Sort languages by name
export const sortedLanguages = [...languages].sort((a, b) => a.name.localeCompare(b.name))

interface LanguageState {
  currentLanguage: Language
  setLanguage: (code: string) => void
  getLanguage: () => Language
}

// Load language from localStorage on initialization
const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return sortedLanguages[0]
  
  try {
    const stored = localStorage.getItem('aurora-language-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      const language = sortedLanguages.find((lang) => lang.code === parsed.code)
      if (language) return language
    }
  } catch (error) {
    console.error('Error loading language from storage:', error)
  }
  
  return sortedLanguages[0] // Default to English
}

export const useLanguageStore = create<LanguageState>()((set, get) => ({
  currentLanguage: getStoredLanguage(),
  setLanguage: (code: string) => {
    const language = sortedLanguages.find((lang) => lang.code === code) || sortedLanguages[0]
    set({ currentLanguage: language })
    // Persist to localStorage
    try {
      localStorage.setItem('aurora-language-storage', JSON.stringify({ code: language.code }))
    } catch (error) {
      console.error('Error saving language to storage:', error)
    }
  },
  getLanguage: () => get().currentLanguage,
}))

