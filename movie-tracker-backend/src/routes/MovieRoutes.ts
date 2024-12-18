import { Router } from 'express'
import { MovieController } from '../controllers/MovieController'
import { authMiddleware } from '../middleware/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// Применяем middleware для проверки авторизации
router.use(authMiddleware)

// Маршруты для фильмов
router.get('/', asyncHandler(MovieController.getAll))
router.get('/:id', asyncHandler(MovieController.getById))
router.post('/library', asyncHandler(MovieController.addToLibrary))
router.put('/:id', asyncHandler(MovieController.updateProgress)) // Обновление прогресса фильма
router.delete('/:id', asyncHandler(MovieController.delete))

export default router
