import 'express'

declare global {
	namespace Express {
		interface Request {
			user?: { id: number; email: string }
		}
	}
}

// Если JwtPayload используется только внутри TypeScript, сделайте его декларацией без экспорта
export interface JwtPayload {
	id: number
	email: string
}
