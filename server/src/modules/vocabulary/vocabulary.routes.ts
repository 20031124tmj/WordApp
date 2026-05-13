import { Router } from 'express';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createVocabularyRoutes(db: Db) {
  const router = Router();
  const vocabularyService = new VocabularyService(db);
  const vocabularyController = new VocabularyController(vocabularyService);

  router.get('/', (req, res) => vocabularyController.list(req, res));
  router.get('/:id', (req, res) => vocabularyController.get(req, res));
  router.get('/:id/words', (req, res) => vocabularyController.getWords(req, res));
  router.post('/', authMiddleware, (req, res) => vocabularyController.create(req as AuthRequest, res));
  router.put('/:id', authMiddleware, (req, res) => vocabularyController.update(req as AuthRequest, res));
  router.delete('/:id', authMiddleware, (req, res) => vocabularyController.remove(req as AuthRequest, res));
  router.post('/:id/import', authMiddleware, (req, res) => vocabularyController.importWords(req as AuthRequest, res));
  router.post('/:id/subscribe', authMiddleware, (req, res) => vocabularyController.subscribe(req as AuthRequest, res));
  router.delete('/:id/subscribe', authMiddleware, (req, res) => vocabularyController.unsubscribe(req as AuthRequest, res));

  return router;
}
