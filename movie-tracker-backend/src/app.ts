import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import { AppDataSource } from './data-source'
import AuthRoutes from './routes/AuthRoutes'
import movieRoutes from './routes/MovieRoutes'
import seriesRoutes from './routes/SeriesRoutes'

dotenv.config()

const app = express()

// Настройка CORS
app.use(
	cors({
		origin: 'http://localhost:3001', // Допустимые источники
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Допустимые методы
		allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
	})
)

app.use(express.json())

// Подключение роутов
app.use('/movies', movieRoutes)
app.use('/series', seriesRoutes)
app.use('/auth', AuthRoutes)

// Глобальный обработчик ошибок
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error('Unhandled error:', err)
	res.status(500).json({
		message: 'Internal Server Error',
		error: err.message,
	})
})

// Инициализация базы данных
AppDataSource.initialize()
	.then(() => {
		console.log('База данных подключена!')
	})
	.catch(error => {
		console.error('Ошибка подключения к базе данных:', error)
	})

// Запуск сервера
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`)
})
