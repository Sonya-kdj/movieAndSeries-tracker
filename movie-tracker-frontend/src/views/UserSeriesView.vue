<template>
	<div class="p-6 bg-gray-50">
		<h2 class="text-2xl font-semibold mb-6">Моя библиотека: Сериалы</h2>

		<!-- Фильтр по странам -->
		<div class="mb-6">
			<label
				for="countryFilter"
				class="block text-lg font-medium text-gray-700"
			>
				Фильтровать по стране:
			</label>
			<select
				id="countryFilter"
				v-model="countryFilter"
				class="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
			>
				<option value="">Все страны</option>
				<option
					v-for="country in uniqueCountries"
					:key="country"
					:value="country"
				>
					{{ country }}
				</option>
			</select>
		</div>

		<!-- Сообщения о состоянии загрузки или ошибке -->
		<div v-if="loading" class="text-blue-500 text-lg">Загрузка...</div>
		<div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

		<!-- Список сериалов -->
		<div
			v-if="filteredSeries.length"
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
		>
			<div
				v-for="serie in filteredSeries"
				:key="serie.id"
				class="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
			>
				<img
					:src="serie.poster"
					alt="Poster"
					class="w-full h-[400px] rounded-lg object-cover mb-4"
				/>
				<h3 class="text-xl font-medium text-gray-800 mb-2">
					{{ serie.title }}
				</h3>
				<p class="text-sm text-gray-600">Страна: {{ serie.countries }}</p>

				<!-- Инпуты для редактирования прогресса -->
				<div class="mt-4">
					<label class="block text-sm font-medium text-gray-700">Сезон:</label>
					<input
						type="number"
						v-model="serie.currentSeason"
						class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
						min="1"
					/>
				</div>
				<div class="mt-4">
					<label class="block text-sm font-medium text-gray-700">Серия:</label>
					<input
						type="number"
						v-model="serie.currentEpisode"
						class="mt-1 p-2 border border-gray-300 rounded-lg w-full"
						min="1"
					/>
				</div>
				<div class="mt-4">
					<label class="block text-sm font-medium text-gray-700"
						>Просмотрено:</label
					>
					<input type="checkbox" v-model="serie.watched" class="mt-1" />
				</div>

				<!-- Кнопка обновления прогресса -->
				<div class="mt-4">
					<button
						@click="updateProgress(serie)"
						class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
					>
						Обновить
					</button>
				</div>

				<!-- Удаление сериала -->
				<button
					@click="deleteSeries(serie.id)"
					class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-4"
				>
					Удалить
				</button>
			</div>
		</div>

		<!-- Пустой результат -->
		<div v-else>
			<p class="text-gray-500">Сериалы не найдены.</p>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
	data() {
		return {
			series: [],
			loading: false,
			error: '',
			countryFilter: '', // Фильтрация по стране
		}
	},
	computed: {
		// Фильтруем сериалы по стране
		filteredSeries() {
			if (!this.countryFilter) return this.series
			return this.series.filter(serie =>
				serie.countries
					.split(', ')
					.some(country => country === this.countryFilter)
			)
		},
		// Получаем уникальные страны
		uniqueCountries() {
			const countries = this.series.flatMap(serie =>
				serie.countries ? serie.countries.split(', ') : []
			)
			return [...new Set(countries)].sort()
		},
	},
	mounted() {
		console.log('Компонент смонтирован, начинаю загрузку данных...')
		this.fetchSeries()
	},
	methods: {
		// Получаем сериалы
		async fetchSeries() {
			this.loading = true
			this.error = ''
			try {
				const authStore = useAuthStore() // Инициализация authStore
				const token = authStore.token // Используем токен из authStore

				if (!token) {
					this.error = 'Пожалуйста, войдите в систему.'
					return
				}

				console.log('Запрос на получение данных о сериалах...')
				const response = await fetch('http://localhost:3000/series', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!response.ok) {
					throw new Error(`Ошибка: ${response.status}`)
				}

				const data = await response.json()

				console.log('Данные о сериалах:', data)

				if (data && Array.isArray(data.series)) {
					// Обработка данных с постерами и странами
					this.series = await Promise.all(
						data.series.map(async serie => {
							const imdbID = serie.imdbID || null
							if (!imdbID) {
								return {
									...serie,
									poster: '/placeholder.png',
									countries: serie.country || 'Не указаны',
								}
							}

							// Обработка данных с использованием OMDB API
							try {
								const omdbResponse = await fetch(
									`http://www.omdbapi.com/?i=${imdbID}&apikey=e8860568`
								)
								const omdbData = await omdbResponse.json()

								if (omdbData.Response === 'True') {
									return {
										...serie,
										poster:
											omdbData.Poster !== 'N/A'
												? omdbData.Poster
												: '/placeholder.png',
										countries: omdbData.Country || 'Не указаны',
									}
								} else {
									return {
										...serie,
										poster: '/placeholder.png',
										countries: 'Не указаны',
									}
								}
							} catch (error) {
								console.error('Ошибка при запросе к OMDB API:', error)
								return {
									...serie,
									poster: '/placeholder.png',
									countries: 'Не указаны',
								}
							}
						})
					)
				} else {
					this.error = 'Данные о сериалах не найдены.'
					console.error('Полученные данные:', data)
				}
			} catch (error) {
				console.error('Ошибка загрузки сериалов:', error)
				this.error = 'Ошибка загрузки сериалов.'
			} finally {
				this.loading = false
			}
		},

		// Обновление прогресса
		async updateProgress(serie) {
			console.log('Обновление прогресса для сериала:', serie.title)
			try {
				const token = localStorage.getItem('token')
				const response = await fetch(
					`http://localhost:3000/series/${serie.id}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							currentSeason: serie.currentSeason,
							currentEpisode: serie.currentEpisode,
							watched: serie.watched,
						}),
					}
				)

				if (!response.ok) throw new Error(`Ошибка: ${response.status}`)
				alert('Прогресс обновлён успешно.')
			} catch (err) {
				this.error = 'Ошибка обновления прогресса.'
				console.error(err)
			}
		},

		// Удаление сериала
		async deleteSeries(id) {
			console.log('Удаление сериала с ID:', id)
			try {
				const token = localStorage.getItem('token')
				const response = await fetch(`http://localhost:3000/series/${id}`, {
					method: 'DELETE',
					headers: { Authorization: `Bearer ${token}` },
				})

				if (!response.ok) throw new Error(`Ошибка: ${response.status}`)

				this.series = this.series.filter(serie => serie.id !== id)
				alert('Сериал успешно удалён.')
			} catch (err) {
				this.error = 'Ошибка удаления сериала.'
				console.error(err)
			}
		},
	},
}
</script>

<style scoped>
/* Дополнительные стили */
</style>
