import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTheme = defineStore('theme', () => {
  const theme = ref('light')
  const role = ref(null)
  let mq = null
  let mqListener = null

  const applyTheme = (t) => {
    const root = document.documentElement
    const setDark = (isDark) => root.classList.toggle('dark', !!isDark)
    const isAdmin = role.value === 'admin'

    // remove previous listener
    if (mq && mqListener) {
      try {
        if (mq.removeEventListener) mq.removeEventListener('change', mqListener)
        else mq.removeListener(mqListener)
      } catch (e) {}
      mq = null; mqListener = null
    }

    if (t === 'dark') {
      // apply dark only for admins
      setDark(isAdmin)
      try { localStorage.setItem('theme', 'dark') } catch (e) {}
    } else if (t === 'light') {
      setDark(false)
      try { localStorage.setItem('theme', 'light') } catch (e) {}
    } else {
      try { localStorage.setItem('theme', 'system') } catch (e) {}
      if (window.matchMedia) {
        mq = window.matchMedia('(prefers-color-scheme: dark)')
        // for system mode, admins follow system; non-admins stay light
        setDark(isAdmin && mq.matches)
        mqListener = (e) => setDark(isAdmin && e.matches)
        if (mq.addEventListener) mq.addEventListener('change', mqListener)
        else mq.addListener(mqListener)
      }
    }
  }

  const setTheme = (t) => {
    theme.value = t
    applyTheme(t)
  }

  const setRole = (r) => {
    role.value = r
    // re-apply current theme when role changes (e.g., user logs in)
    applyTheme(theme.value)
  }

  const toggleTheme = () => {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  const init = (opts = {}) => {
    // precedence: provided option > localStorage > system default
    let stored = null
    try { stored = localStorage.getItem('theme') } catch (e) { stored = null }
    const start = opts.default || stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    theme.value = start === 'system' ? 'system' : start
    applyTheme(theme.value)
  }

  return { theme, setTheme, toggleTheme, init, setRole }
})
