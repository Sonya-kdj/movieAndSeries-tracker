import { Router } from 'express'
import { SeriesController } from '../controllers/SeriesController'
import { authMiddleware } from '../middleware/authMiddleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.use(authMiddleware)

router.get('/', asyncHandler(SeriesController.getAll))

router.patch('/:id', asyncHandler(SeriesController.updateSeries))

router.get('/:id', asyncHandler(SeriesController.getById))

router.post('/library', asyncHandler(SeriesController.addToLibrary))

router.post('/', asyncHandler(SeriesController.create))

router.delete('/:id', asyncHandler(SeriesController.delete))

export default router
