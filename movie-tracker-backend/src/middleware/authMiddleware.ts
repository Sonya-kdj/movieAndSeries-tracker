import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/express'

export const authMiddleware: RequestHandler = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res
			.status(401)
			.json({ message: 'Authorization header missing or malformed' })
		return // Завершаем выполнение функции
	}

	const token = authHeader.split(' ')[1]

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload

		// Добавляем пользователя в запрос
		req.user = { id: decoded.id, email: decoded.email }

		next() // Переходим к следующему middleware
	} catch (error) {
		res.status(403).json({ message: 'Invalid or expired token' })
		return // Завершаем выполнение функции
	}
}
