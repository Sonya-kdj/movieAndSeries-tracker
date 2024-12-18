<template>
	<div class="flex items-center justify-center min-h-screen bg-gray-100">
		<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
			<h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
			<form @submit.prevent="handleLogin">
				<div class="mb-4">
					<label for="email" class="block text-sm font-semibold text-gray-700"
						>Email</label
					>
					<input
						v-model="email"
						type="email"
						id="email"
						placeholder="Email"
						required
						class="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="mb-6">
					<label
						for="password"
						class="block text-sm font-semibold text-gray-700"
						>Password</label
					>
					<input
						v-model="password"
						type="password"
						id="password"
						placeholder="Password"
						required
						class="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<button
					type="submit"
					class="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Login
				</button>
			</form>

			<p v-if="error" class="text-red-500 text-sm mt-4 text-center">
				{{ error }}
			</p>
		</div>
	</div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
	data() {
		return {
			email: '',
			password: '',
			error: '',
		}
	},
	methods: {
		async handleLogin() {
			const authStore = useAuthStore()
			try {
				await authStore.login(this.email, this.password)
				this.$router.push('/movies')
			} catch (error) {
				this.error = error.message || 'Ошибка входа. Проверьте данные.'
			}
		},
	},
}
</script>

<style scoped>
/* Встроенные стили не нужны, все будет стилизовано с помощью Tailwind CSS */
</style>
