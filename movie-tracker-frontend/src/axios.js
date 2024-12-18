// src/axios.js
import axios from 'axios'

const apiClient = axios.create({
	baseURL: 'http://localhost:3000', // Базовый URL для запросов
	headers: {
		'Content-Type': 'application/json',
	},
})

export default apiClient
