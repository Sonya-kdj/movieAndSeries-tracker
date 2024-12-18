<template>
	<div>
		<div class="">
			<h2 class="text-2xl font-bold mb-4">Фильмы</h2>
			<div v-if="movies.length" class="grid grid-cols-3 gap-6">
				<div
					v-for="movie in movies"
					:key="movie.imdbID"
					class="bg-white rounded-lg shadow-lg overflow-hidden text-center"
				>
					<img
						:src="movie.Poster || '/placeholder.png'"
						:alt="movie.Title"
						class="w-full h-[400px] object-cover"
					/>
					<div class="p-4">
						<h3 class="text-xl font-semibold text-gray-800">
							{{ movie.Title }}
						</h3>
						<p class="text-gray-600">Год: {{ movie.Year }}</p>
						<p class="text-gray-600">Страна: {{ movie.Country || 'N/A' }}</p>
						<button
							@click="addToLibrary(movie)"
							class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
						>
							Добавить в библиотеку
						</button>
					</div>
				</div>
			</div>
			<div v-else>
				<p class="text-gray-500">Фильмы не найдены</p>
			</div>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
	data() {
		return {
			movies: [],
		}
	},
	mounted() {
		this.fetchMovies()
	},
	methods: {
		async fetchMovies() {
			try {
				const response = await fetch(
					`http://www.omdbapi.com/?s=movie&apikey=e8860568`
				)
				const data = await response.json()

				if (data.Search) {
					const movieDetailsPromises = data.Search.map(async movie => {
						const detailsResponse = await fetch(
							`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=e8860568`
						)
						const detailsData = await detailsResponse.json()
						return {
							...movie,
							Country: detailsData.Country,
							Poster: detailsData.Poster,
						}
					})
					this.movies = await Promise.all(movieDetailsPromises)
				} else {
					console.error('No movies found:', data.Error)
				}
			} catch (error) {
				console.error('Error fetching movies:', error)
			}
		},

		async addToLibrary(movie) {
			const authStore = useAuthStore()
			if (!authStore.token) {
				alert(
					'Пожалуйста, войдите в систему, чтобы добавить фильм в библиотеку.'
				)
				return
			}

			try {
				const response = await fetch('http://localhost:3000/movies/library', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${authStore.token}`,
					},
					body: JSON.stringify({
						imdbID: movie.imdbID,
						title: movie.Title,
						year: movie.Year,
						country: movie.Country || 'N/A',
					}),
				})

				if (response.ok) {
					alert('Фильм добавлен в вашу библиотеку')
				} else {
					const errorData = await response.json()
					console.error('Error adding movie to library:', errorData)
				}
			} catch (error) {
				console.error('Error adding movie to library:', error)
			}
		},
	},
}
</script>

<style scoped>
/* Tailwind стили применяются в шаблоне */
</style>
