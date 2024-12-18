import { defineStore } from 'pinia'
import apiClient from '../axios'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		token: localStorage.getItem('token') || null,
		user: null,
	}),
	actions: {
		// Метод для обновления заголовков с токеном
		updateAuthHeaders() {
			if (this.token) {
				apiClient.defaults.headers.common[
					'Authorization'
				] = `Bearer ${this.token}`
			} else {
				delete apiClient.defaults.headers.common['Authorization']
			}
		},

		// Регистрация
		async register(email, password) {
			try {
				console.log('Регистрация: отправка данных', { email, password })
				const response = await apiClient.post('/auth/register', {
					email,
					password,
				})

				if (response.data.token && response.data.user) {
					this.token = response.data.token
					this.user = response.data.user
					localStorage.setItem('token', this.token)
					this.updateAuthHeaders()
					console.log('Регистрация успешна:', response.data)
				} else {
					throw new Error('Некорректный ответ сервера')
				}
			} catch (error) {
				console.error('Ошибка регистрации:', error.response || error.message)
				throw new Error(error.response?.data?.message || 'Ошибка регистрации')
			}
		},

		// Логин
		async login(email, password) {
			try {
				console.log('Вход: отправка данных', { email, password })
				const response = await apiClient.post('/auth/login', {
					email,
					password,
				})

				if (response.data.token && response.data.user) {
					this.token = response.data.token
					this.user = response.data.user
					localStorage.setItem('token', this.token)
					this.updateAuthHeaders()
					console.log('Вход успешен:', response.data)
				} else {
					throw new Error('Некорректный ответ сервера')
				}
			} catch (error) {
				console.error('Ошибка входа:', error.response || error.message)
				throw new Error(error.response?.data?.message || 'Ошибка входа')
			}
		},

		// Логаут
		logout() {
			this.token = null
			this.user = null
			localStorage.removeItem('token')
			this.updateAuthHeaders()
			console.log('Пользователь вышел из системы')
		},
	},
})
