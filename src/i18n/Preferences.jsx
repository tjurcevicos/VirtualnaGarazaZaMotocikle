import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translate } from './translations'

const Context = createContext(null)
const themes = ['dark', 'light', 'blue', 'graphite', 'emerald', 'purple']
const languages = ['hr', 'en', 'de', 'it', 'sl']

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => themes.includes(localStorage.getItem('vg-theme')) ? localStorage.getItem('vg-theme') : 'dark')
  const [language, setLanguage] = useState(() => languages.includes(localStorage.getItem('vg-language')) ? localStorage.getItem('vg-language') : 'hr')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('vg-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('vg-language', language)
  }, [language])
  const value = useMemo(() => ({ theme, setTheme, language, setLanguage, t: (value) => translate(value, language) }), [theme, language])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function usePreferences() { return useContext(Context) }
