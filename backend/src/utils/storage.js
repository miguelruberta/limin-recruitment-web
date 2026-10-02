import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';
import { ALLOWED_DOCUMENT_MIME, ALLOWED_IMAGE_MIME } from '../config/constants.js';
import { randomUuid } from './hash.js';

const UPLOAD_ROOT = path.resolve(process.cwd(), env.UPLOAD_DIR);
const PUBLIC_PREFIX = `/${env.UPLOAD_DIR}`;

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  [ALLOWED_DOCUMENT_MIME[1]]: '.docx',
};

export function ensureUploadRoot() {
  return fs.mkdir(UPLOAD_ROOT, { recursive: true });
}

export async function saveUpload(buffer, { mimeType, folder }) {
  await ensureUploadRoot();
  const directory = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(directory, { recursive: true });

  const extension = EXTENSIONS[mimeType] ?? '.bin';
  const filename = `${randomUuid()}${extension}`;
  await fs.writeFile(path.join(directory, filename), buffer);

  return `${folder}/${filename}`;
}

export async function removeUpload(relativePath) {
  if (!relativePath) return;
  const absolute = path.resolve(UPLOAD_ROOT, relativePath);
  if (!absolute.startsWith(UPLOAD_ROOT)) throw new Error('Path berkas tidak valid');
  await fs.unlink(absolute).catch(() => undefined);
}

export function toPublicUrl(relativePath) {
  if (!relativePath) return null;
  if (relativePath.startsWith(PUBLIC_PREFIX)) return relativePath;
  return `${PUBLIC_PREFIX}/${relativePath}`;
}

export function isImageMime(mimeType) {
  return ALLOWED_IMAGE_MIME.includes(mimeType);
}