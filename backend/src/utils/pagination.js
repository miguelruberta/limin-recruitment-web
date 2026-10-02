import { PAGINATION } from '../config/constants.js';

export function normalizePagination(query = {}) {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : PAGINATION.DEFAULT_PAGE;
  const requestedLimit = Number.isInteger(parsedLimit) && parsedLimit > 0
    ? parsedLimit
    : PAGINATION.DEFAULT_LIMIT;
  const limit = Math.min(requestedLimit, PAGINATION.MAX_LIMIT);

  return { page, limit, offset: (page - 1) * limit };
}

export function buildMeta(total, page, limit) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}