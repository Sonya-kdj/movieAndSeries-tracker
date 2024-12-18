<template>
	<div class="p-6 bg-gray-50">
		<h2 class="text-2xl font-semibold mb-6">Моя библиотека: Фильмы</h2>

		<div class="mb-6">
			<label for="country" class="block text-lg font-medium text-gray-700">
				Выберите страну:
			</label>
			<select
				v-model="selectedCountry"
				@change="applyFilter"
				class="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
			>
				<option value="">Все страны</option>
				<option v-for="country in countries" :key="country" :value="country">
					{{ country }}
				</option>
			</select>
		</div>

		<ul
			v-if="filteredMovies.length > 0"
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
		>
			<li
				v-for="movie in filteredMovies"
				:key="movie.id"
				class="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:scale-105"
			>
				<div class="mb-4">
					<img
						:src="movie.Poster ? movie.Poster : '/placeholder.png'"
						alt="Poster"
						class="w-full h-[600px] object-cover"
					/>
				</div>
				<div class="p-6">
					<h3 class="font-semibold text-xl text-gray-800 mb-3 text-center">
						{{ movie.title }}
					</h3>
					<p class="text-sm text-gray-600 mb-4 text-center">
						{{ movie.Year }} | {{ movie.Country || 'N/A' }}
					</p>
					<div class="mb-6">
						<label
							for="currentMinute"
							class="block text-sm font-medium text-gray-700"
						>
							Текущая минута:
						</label>
						<input
							type="number"
							v-model="movie.currentMinute"
							:min="0"
							class="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
						/>
					</div>
					<div class="mb-6">
						<label
							for="watched"
							class="block text-sm font-medium text-gray-700"
						>
							Просмотрено:
						</label>
						<input
							type="checkbox"
							v-model="movie.watched"
							class="mt-2 w-5 h-5 focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div class="flex flex-col space-y-3">
						<button
							@click="updateMovie(movie)"
							class="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 active:scale-95 transition-transform"
						>
							Сохранить
						</button>
						<button
							@click="deleteMovie(movie.id)"
							class="w-full bg-red-500 text-white font-semibold py-3 rounded-md hover:bg-red-600 active:scale-95 transition-transform"
						>
							Удалить
						</button>
					</div>
				</div>
			</li>
		</ul>

		<p v-else class="text-center text-xl text-gray-600 mt-10">
			Фильмы не найдены.
		</p>
	</div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import apiClient from '../axios'
import { useAuthStore } from '../stores/auth'

export default {
	name: 'UserMovieView',
	setup() {
		const authStore = useAuthStore()
		const movies = ref([])
		const countries = ref([])
		const selectedCountry = ref('')
		const loading = ref(false)
		const error = ref(null)
		const page = ref(1)
		const limit = ref(10)

		// Получение фильмов
		const fetchMovies = async () => {
			loading.value = true
			error.value = null
			try {
				const token = authStore.token
				if (!token) {
					movies.value = []
					return
				}

				const response = await apiClient.get('/movies', {
					headers: { Authorization: `Bearer ${token}` },
					params: { page: page.value, limit: limit.value },
				})

				if (response.data && Array.isArray(response.data.movies)) {
					const movieDetailsPromises = response.data.movies.map(async movie => {
						const detailsResponse = await fetch(
							`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=e8860568`
						)
						const detailsData = await detailsResponse.json()

						const countriesArray = detailsData.Country
							? detailsData.Country.split(',').map(country => country.trim())
							: []

						return {
							...movie,
							Country: countriesArray.join(', ') || 'N/A',
							Poster: detailsData.Poster || '/placeholder.png',
							originalCountries: countriesArray,
						}
					})

					movies.value = await Promise.all(movieDetailsPromises)
					countries.value = [
						...new Set(movies.value.flatMap(movie => movie.originalCountries)),
					]
				} else {
					throw new Error('Некорректный формат ответа API')
				}
			} catch (err) {
				error.value = err.message || 'Ошибка загрузки фильмов'
				console.error('Ошибка при запросе:', error.value)
			} finally {
				loading.value = false
			}
		}

		// Применение фильтрации
		const filteredMovies = computed(() => {
			if (!selectedCountry.value) return movies.value
			return movies.value.filter(movie =>
				movie.originalCountries.includes(selectedCountry.value)
			)
		})

		const applyFilter = () => {
			// Для обновления представления в интерфейсе
			console.log('Фильтр применён:', selectedCountry.value)
		}

		const updateMovie = async movie => {
			try {
				const token = authStore.token
				if (!token) {
					throw new Error('Токен отсутствует')
				}

				await apiClient.put(`/movies/${movie.id}`, movie, {
					headers: { Authorization: `Bearer ${token}` },
				})

				alert('Фильм обновлен!')
			} catch (err) {
				console.error('Ошибка обновления фильма:', err)
			}
		}

		const deleteMovie = async id => {
			try {
				const token = authStore.token
				if (!token) {
					throw new Error('Токен отсутствует')
				}

				await apiClient.delete(`/movies/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				})

				alert('Фильм удален!')
				fetchMovies()
			} catch (err) {
				console.error('Ошибка удаления фильма:', err)
			}
		}

		onMounted(() => {
			fetchMovies()
		})

		return {
			movies,
			countries,
			selectedCountry,
			filteredMovies,
			applyFilter,
			updateMovie,
			deleteMovie,
			loading,
			error,
		}
	},
}
</script>

<style scoped></style>
