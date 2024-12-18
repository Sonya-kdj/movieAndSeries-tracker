<template>
	<div>
		<h2 class="text-2xl font-bold mb-4">Сериалы</h2>
		<div v-if="loading" class="text-blue-500">Загрузка...</div>
		<div v-if="error" class="text-red-500">{{ error }}</div>

		<div
			v-if="series.length"
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
		>
			<div
				v-for="serie in series"
				:key="serie.imdbID"
				class="bg-white rounded-lg shadow-lg overflow-hidden text-center"
			>
				<img
					:src="serie.Poster !== 'N/A' ? serie.Poster : '/placeholder.png'"
					:alt="serie.Title"
					class="w-full h-[400px] object-cover"
				/>
				<div class="p-4">
					<h3 class="text-xl font-semibold text-gray-800">{{ serie.Title }}</h3>
					<p class="text-gray-600">Год: {{ serie.Year }}</p>
					<!-- Проверяем и выводим страну -->
					<p class="text-gray-600">
						Страна: {{ serie.Country ? serie.Country : 'Не указана' }}
					</p>
					<button
						@click="addToLibrary(serie)"
						class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					>
						Добавить в библиотеку
					</button>
				</div>
			</div>
		</div>
		<div v-else>
			<p class="text-gray-500">Сериалы не найдены.</p>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
	name: 'SeriesView',
	data() {
		return {
			series: [],
			loading: false,
			error: '',
		}
	},
	mounted() {
		this.fetchSeries()
	},
	methods: {
		async fetchSeries() {
			this.loading = true
			try {
				const response = await fetch(
					'http://www.omdbapi.com/?s=series&apikey=e8860568'
				)
				const data = await response.json()

				if (data.Search) {
					// Получаем подробную информацию по каждому сериалу
					const seriesWithDetails = await Promise.all(
						data.Search.map(async serie => {
							const detailResponse = await fetch(
								`http://www.omdbapi.com/?i=${serie.imdbID}&apikey=e8860568`
							)
							const detailData = await detailResponse.json()

							// Возвращаем сериал с дополнительной информацией (например, страной)
							return {
								...serie,
								Country: detailData.Country || 'Не указана', // Добавляем страну
							}
						})
					)

					this.series = seriesWithDetails
				} else {
					this.error = 'Сериалы не найдены.'
				}
			} catch (error) {
				this.error = 'Ошибка при загрузке сериалов.'
				console.error('Ошибка при загрузке сериалов:', error)
			} finally {
				this.loading = false
			}
		},
		async addToLibrary(serie) {
			const authStore = useAuthStore()

			if (!authStore.token) {
				alert('Пожалуйста, войдите, чтобы добавить сериал в библиотеку.')
				return
			}

			const entryData = {
				title: serie.Title,
				year: serie.Year,
				country: serie.Country || 'Не указана',
				season: 1,
				episode: 1,
				watched: false,
				currentSeason: 1,
				currentEpisode: 1,
				imdbID: serie.imdbID || null,
				userId: authStore.userId, // Используем userId текущего пользователя
			}

			try {
				const response = await fetch('http://localhost:3000/series/library', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${authStore.token}`,
					},
					body: JSON.stringify(entryData),
				})

				if (!response.ok) {
					const contentType = response.headers.get('Content-Type')
					if (contentType && contentType.includes('application/json')) {
						const errorData = await response.json()
						this.error =
							errorData.message || 'Ошибка при добавлении сериала в библиотеку.'
					} else {
						this.error = `Ошибка сервера: ${response.status}`
					}
					return
				}

				const result = await response.json()
				alert(`Сериал "${result.title}" успешно добавлен в вашу библиотеку.`)
			} catch (error) {
				console.error('Ошибка при добавлении сериала в библиотеку:', error)
				this.error =
					'Ошибка при добавлении сериала в библиотеку. Проверь соединение с сервером.'
			}
		},
	},
}
</script>

<style scoped>
/* Tailwind стили применяются в шаблоне */
</style>
