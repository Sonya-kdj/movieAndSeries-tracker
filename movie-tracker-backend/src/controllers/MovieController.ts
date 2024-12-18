import { Request, Response } from 'express'
import { In } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Movie } from '../entities/Movie'
import { User } from '../entities/User'

const movieRepository = AppDataSource.getRepository(Movie)
const userRepository = AppDataSource.getRepository(User)

export class MovieController {
	// Получить все фильмы с пагинацией, фильтрацией и привязкой к пользователю
	// Получить все фильмы с пагинацией, фильтрацией и привязкой к пользователю
	static async getAll(req: Request, res: Response) {
		const { page = 1, limit = 10, country } = req.query
		const user = req.user as User // Информация о пользователе из middleware

		try {
			if (!user) {
				return res.status(401).json({ message: 'Unauthorized' })
			}

			const whereCondition: any = {
				user: { id: user.id }, // Фильтрация по userId
			}

			// Если есть параметр страны, добавляем фильтрацию
			if (country && country !== 'N/A') {
				const countries = Array.isArray(country) ? country : [country]
				whereCondition.country = In(countries.map(c => String(c)))
			}

			console.log('Фильтр для фильмов:', whereCondition)

			// Получаем фильмы с пагинацией
			const [movies, total] = await movieRepository.findAndCount({
				where: whereCondition,
				skip: (Number(page) - 1) * Number(limit),
				take: Number(limit),
			})

			console.log(`Фильмы для пользователя ${user.id}:`, movies)

			res.json({ movies, total })
		} catch (error) {
			console.error('Ошибка получения фильмов:', error)
			res.status(500).json({ message: 'Ошибка при получении фильмов' })
		}
	}

	// Получить фильм по ID
	static async getById(req: Request, res: Response) {
		try {
			const movie = await movieRepository.findOne({
				where: { id: +req.params.id },
				relations: ['user'],
			})
			if (!movie) {
				return res.status(404).json({ message: 'Movie not found' })
			}
			res.json(movie)
		} catch (error) {
			console.error('Ошибка при получении фильма:', error)
			res.status(500).json({ message: 'Error fetching movie' })
		}
	}

	// Добавить фильм в библиотеку пользователя
	static async addToLibrary(req: Request, res: Response) {
		const user = req.user as User // Информация о пользователе из middleware

		try {
			const {
				imdbID,
				title,
				year,
				country,
				runtime,
				watched = false,
				currentMinute = 0,
			} = req.body

			if (!imdbID || !title) {
				return res
					.status(400)
					.json({ message: 'Missing required fields (imdbID, title)' })
			}

			const existingMovie = await movieRepository.findOne({
				where: { imdbID, user: { id: user.id } },
				relations: ['user'],
			})

			if (existingMovie) {
				return res.status(400).json({ message: 'Movie already in library' })
			}

			const newMovie = movieRepository.create({
				imdbID,
				title,
				year,
				country,
				runtime,
				watched,
				currentMinute,
				user,
			})

			const savedMovie = await movieRepository.save(newMovie)

			console.log('Новый фильм добавлен:', savedMovie)

			res.status(201).json(savedMovie)
		} catch (error) {
			console.error('Ошибка добавления фильма в библиотеку:', error)
			res.status(500).json({ message: 'Ошибка добавления фильма в библиотеку' })
		}
	}

	// Обновить прогресс фильма (текущую минуту или просмотренность)
	static async updateProgress(req: Request, res: Response) {
		try {
			const { id } = req.params
			const { currentMinute, watched } = req.body

			const movie = await movieRepository.findOne({
				where: { id: +id },
				relations: ['user'],
			})

			if (!movie) {
				return res.status(404).json({ message: 'Фильм не найден' })
			}

			if (currentMinute !== undefined) movie.currentMinute = currentMinute
			if (watched !== undefined) movie.watched = watched

			const updatedMovie = await movieRepository.save(movie)

			console.log('Фильм обновлен:', updatedMovie)

			res.json(updatedMovie)
		} catch (error) {
			console.error('Ошибка обновления прогресса фильма:', error)
			res
				.status(500)
				.json({ message: 'Ошибка при обновлении прогресса фильма' })
		}
	}

	// Удалить фильм
	static async delete(req: Request, res: Response) {
		try {
			const { id } = req.params

			const result = await movieRepository.delete({ id: +id })

			if (result.affected === 0) {
				return res.status(404).json({ message: 'Фильм не найден' })
			}

			console.log(`Фильм с id ${id} удален.`)

			res.status(204).send()
		} catch (error) {
			console.error('Ошибка удаления фильма:', error)
			res.status(500).json({ message: 'Ошибка удаления фильма' })
		}
	}
}
