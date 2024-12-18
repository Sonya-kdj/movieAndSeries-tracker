import axios from 'axios'

export const fetchUserLibrary = async () => {
	try {
		const response = await axios.get('/api/library', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		return response.data
	} catch (error) {
		console.error('Ошибка получения библиотеки:', error)
		throw error
	}
}
