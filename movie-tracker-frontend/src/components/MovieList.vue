<template>
	<div>
		<h1>Movies</h1>
		<ul>
			<li v-for="movie in movies" :key="movie.id">
				{{ movie.title }} ({{ movie.year }})
			</li>
		</ul>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			movies: [],
		}
	},
	async created() {
		const response = await axios.get('https://www.omdbapi.com/', {
			params: {
				apikey: 'e8860568',
				s: 'movie', // Поиск фильма
			},
		})
		this.movies = response.data.Search || []
	},
}
</script>
