<template>
	<div id="app" class="">
		<header>
			<h1>Tracker</h1>
			<nav>
				<ul>
					<li><router-link to="/movies">Фильмы</router-link></li>
					<li><router-link to="/series">Сериалы</router-link></li>
					<li><router-link to="/user/movies">Мои фильмы</router-link></li>
					<li><router-link to="/user/series">Мои сериалы</router-link></li>
					<li><router-link to="/login">Войти</router-link></li>
					<li><router-link to="/register">Зарегистрироваться</router-link></li>
				</ul>
			</nav>
		</header>

		<main>
			<router-view />
		</main>
	</div>
</template>

<script>
export default {
	name: 'App',
}
</script>

<style>
header {
	background-color: #333;
	color: white;
	padding: 10px;
}

nav ul {
	display: flex;
	list-style-type: none;
	padding: 0;
}

nav li {
	margin-right: 15px;
}

nav a {
	color: white;
	text-decoration: none;
}

nav a.router-link-active {
	text-decoration: underline;
}
</style>
