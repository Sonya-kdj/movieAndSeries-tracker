<template>
	<form @submit.prevent="addMovie">
		<input v-model="title" placeholder="Title" required />
		<input v-model="year" type="number" placeholder="Year" required />
		<button type="submit">Add Movie</button>
	</form>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			year: '',
		}
	},
	methods: {
		addMovie() {
			// console.log('Movie Added:', { title: this.title, year: this.year })
		},
	},
}
</script>
