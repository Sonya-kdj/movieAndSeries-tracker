// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	server: {
		port: 3001,
		proxy: {
			'/auth': 'http://localhost:3000', // Прокси для /auth запросов
			'/movies': 'http://localhost:3000', // Прокси для /movies запросов
			'/series': 'http://localhost:3000', // Прокси для /series запросов
		},
	},
})
