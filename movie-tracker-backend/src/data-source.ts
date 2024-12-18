import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { Movie } from './entities/Movie'
import { Series } from './entities/Series'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
	type: 'mysql',
	host: 'localhost',
	port: 8889,
	username: 'root',
	password: 'root',
	database: 'movie-tracker',
	synchronize: true,
	logging: true,
	entities: [User, Series, Movie],
	migrations: ['.src/migrations/*.ts'],
	subscribers: [],
})
