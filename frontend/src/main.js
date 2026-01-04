import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import { useTheme } from './stores/useTheme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// Initialize theme store early so it applies class and listeners
const themeStore = useTheme(pinia)
try { themeStore.init() } catch (e) { /* ignore */ }

app.mount('#app')
