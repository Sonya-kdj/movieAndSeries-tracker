import { Request, Response } from 'express'
import { In } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Series } from '../entities/Series'
import { User } from '../entities/User'

const seriesRepository = AppDataSource.getRepository(Series)

export class SeriesController {
	// Получение всех сериалов с фильтрами
	static async getAll(req: Request, res: Response) {
		const { page = 1, limit = 10, country } = req.query
		const user = req.user as User | undefined // Получаем текущего пользователя

		if (!user) {
			return res.status(401).json({ message: 'Пользователь не авторизован' })
		}

		console.log('Запрос фильтрации:', { page, limit, country, userId: user.id })

		const whereCondition: any = { user: { id: user.id } } // Фильтруем сериалы по userId

		if (country) {
			const countries = Array.isArray(country) ? country : [country]
			whereCondition.country = In(countries.map(c => String(c)))
		}

		try {
			const [series, total] = await seriesRepository.findAndCount({
				where: whereCondition,
				skip: (Number(page) - 1) * Number(limit),
				take: Number(limit),
			})

			console.log('Найденные сериалы:', series)
			res.json({ series, total })
		} catch (error) {
			res.status(500).json({ message: 'Ошибка при получении сериалов' })
		}
	}

	// Метод добавления сериала в личную библиотеку
	static async addToLibrary(req: Request, res: Response) {
		const user = req.user as User | undefined
		console.log('Добавление сериала. Пользователь:', user)

		if (!user) {
			return res
				.status(400)
				.json({ message: 'User not found or not authenticated' })
		}

		try {
			console.log('Данные запроса:', req.body)

			const { title, year, country } = req.body
			if (!title || !year || !country) {
				return res.status(400).json({ message: 'Missing required fields' })
			}

			const sanitizedYear = year.includes('–') ? year.split('–')[0] : year
			console.log('Обработанный год:', sanitizedYear)

			const newSeries = seriesRepository.create({
				...req.body,
				user, // Привязываем сериала к текущему пользователю
				year: sanitizedYear,
			})
			const savedSeries = await seriesRepository.save(newSeries)

			console.log('Сериал добавлен:', savedSeries)
			res.status(201).json(savedSeries)
		} catch (error) {
			if (error instanceof Error) {
				console.error('Ошибка:', error.message)
				res
					.status(500)
					.json({ message: 'Ошибка сервера', error: error.message })
			} else {
				console.error('Неизвестная ошибка:', error)
				res.status(500).json({ message: 'Unknown error occurred' })
			}
		}
	}

	// Получение сериала по ID
	static async getById(req: Request, res: Response) {
		try {
			const series = await seriesRepository.findOne({
				where: { id: +req.params.id },
			})
			if (!series) {
				return res.status(404).json({ message: 'Сериал не найден' })
			}
			res.json(series)
		} catch (error) {
			res.status(500).json({ message: 'Ошибка при получении сериала' })
		}
	}

	// Создание нового сериала
	static async create(req: Request, res: Response) {
		try {
			const user = req.user // Проверяем пользователя (он должен быть аутентифицирован)
			if (!user) {
				return res
					.status(400)
					.json({ message: 'User not found or not authenticated' })
			}

			const newSeries = seriesRepository.create({
				...req.body,
				user, // Привязываем сериала к текущему пользователю
			})
			const savedSeries = await seriesRepository.save(newSeries)
			res.status(201).json(savedSeries)
		} catch (error) {
			res.status(500).json({ message: 'Ошибка при сохранении сериала' })
		}
	}

	// Обновление данных сериала
	static async updateSeries(req: Request, res: Response) {
		try {
			const user = req.user as User
			console.log('Аутентифицированный пользователь:', user)

			if (!user) {
				return res.status(401).json({ message: 'Пользователь не авторизован.' })
			}

			const seriesId = +req.params.id
			console.log('ID сериала:', seriesId)

			const { currentSeason, currentEpisode, watched } = req.body
			console.log('Данные для обновления:', {
				currentSeason,
				currentEpisode,
				watched,
			})

			const series = await seriesRepository.findOne({
				where: { id: seriesId, user: { id: user.id } },
			})
			console.log('Найденный сериал:', series)

			if (!series) {
				return res.status(404).json({ message: 'Сериал не найден.' })
			}

			series.currentSeason = currentSeason ?? series.currentSeason
			series.currentEpisode = currentEpisode ?? series.currentEpisode
			series.watched = watched ?? series.watched

			const updatedSeries = await seriesRepository.save(series)
			console.log('Обновленный сериал:', updatedSeries)

			res.json(updatedSeries)
		} catch (error) {
			console.error('Ошибка при обновлении сериала:', error)
			res.status(500).json({ message: 'Ошибка при обновлении данных сериала.' })
		}
	}

	// Удаление сериала по ID
	static async delete(req: Request, res: Response) {
		try {
			const result = await seriesRepository.delete(+req.params.id)
			if (result.affected === 0) {
				return res.status(404).json({ message: 'Сериал не найден' })
			}
			res.status(204).send()
		} catch (error) {
			res.status(500).json({ message: 'Ошибка при удалении сериала' })
		}
	}
}
