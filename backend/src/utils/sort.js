export function resolveSort(sort, allowedColumns, fallbackColumn = 'id') {
  const safeFallback = allowedColumns.includes(fallbackColumn)
    ? fallbackColumn
    : (allowedColumns[0] ?? fallbackColumn);

  const normalized = typeof sort === 'string' ? sort.trim() : '';

  if (normalized === '') {
    return { column: safeFallback, direction: 'ASC' };
  }

  const isDescending = normalized.startsWith('-');
  const requestedColumn = isDescending ? normalized.slice(1) : normalized;

  if (!allowedColumns.includes(requestedColumn)) {
    return { column: safeFallback, direction: 'ASC' };
  }

  return { column: requestedColumn, direction: isDescending ? 'DESC' : 'ASC' };
}