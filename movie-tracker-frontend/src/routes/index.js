import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import MoviesView from '../views/MoviesView.vue'
import RegisterView from '../views/RegisterView.vue'
import SeriesView from '../views/SeriesView.vue'
import UserMovieView from '../views/UserMovieView.vue' // Новый компонент
import UserSeriesView from '../views/UserSeriesView.vue' // Новый компонент

const routes = [
	{ path: '/', redirect: '/movies' },
	{ path: '/register', name: 'Register', component: RegisterView },
	{ path: '/login', name: 'Login', component: LoginView },
	{
		path: '/movies',
		component: MoviesView,
		meta: { requiresAuth: true },
	},
	{
		path: '/series',
		component: SeriesView,
		meta: { requiresAuth: true },
	},
	{
		path: '/user/movies',
		name: 'UserMovies',
		component: UserMovieView,
		meta: { requiresAuth: true }, // Защищенный маршрут
	},
	{
		path: '/user/series',
		name: 'UserSeries',
		component: UserSeriesView,
		meta: { requiresAuth: true }, // Защищенный маршрут
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()

	if (to.meta.requiresAuth && !authStore.token) {
		next('/login')
	} else {
		next()
	}
})

export default router
