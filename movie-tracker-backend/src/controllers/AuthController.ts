import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

const userRepository = AppDataSource.getRepository(User)

export class AuthController {
	// Регистрация пользователя
	static async register(req: Request, res: Response, next: NextFunction) {
		console.log('Register endpoint hit:', req.body) // Логируем входящие данные
		try {
			const { email, password } = req.body
			console.log('Received email:', email) // Логируем email для проверки
			// Проверка на существующего пользователя
			const existingUser = await userRepository.findOneBy({ email })
			if (existingUser) {
				return res.status(400).json({ message: 'User already exists' })
			}

			// Хэширование пароля
			const hashedPassword = await bcrypt.hash(password, 10)

			// Создание нового пользователя
			const newUser = userRepository.create({
				email,
				password: hashedPassword,
			})
			const savedUser = await userRepository.save(newUser)

			// Генерация JWT
			const token = jwt.sign(
				{ id: savedUser.id, email: savedUser.email },
				process.env.JWT_SECRET || 'default_secret',
				{
					expiresIn: '1h', // срок действия токена
				}
			)

			// Возвращаем ответ с данными пользователя и токеном
			res.status(201).json({
				message: 'User registered successfully',
				user: { id: savedUser.id, email: savedUser.email },
				token,
			})
		} catch (error) {
			console.error('Registration error:', error) // Логирование
			next(error)
		}
	}

	// Логин пользователя
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body

			// Проверка, существует ли пользователь
			const user = await userRepository.findOneBy({ email })
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			// Проверка пароля
			const isPasswordValid = await bcrypt.compare(password, user.password)
			if (!isPasswordValid) {
				return res.status(401).json({ message: 'Invalid credentials' })
			}

			// Генерация JWT
			const token = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET || 'default_secret',
				{
					expiresIn: '1h', // срок действия токена
				}
			)

			// Удаление пароля из ответа
			const { password: _, ...userWithoutPassword } = user

			// Возвращаем ответ с данными пользователя и токеном
			res.json({
				message: 'Login successful',
				user: userWithoutPassword,
				token,
			})
		} catch (error) {
			next(error)
		}
	}
}
