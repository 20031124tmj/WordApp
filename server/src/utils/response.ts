import { Response } from 'express';

export function success(res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json({ data });
}

export function successPaginated(
  res: Response,
  data: any,
  meta: { page: number; page_size: number; total: number }
) {
  return res.json({ data, meta });
}

export function error(res: Response, code: string, message: string, statusCode = 400) {
  return res.status(statusCode).json({ error: { code, message } });
}
