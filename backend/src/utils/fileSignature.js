import { AppError } from '../core/AppError.js';
import { ALLOWED_DOCUMENT_MIME } from '../config/constants.js';

const [PDF_MIME, DOCX_MIME] = ALLOWED_DOCUMENT_MIME;

const SIGNATURES = [
  { mime: 'image/jpeg', match: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mime: 'image/png',
    match: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    mime: 'image/webp',
    match: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
  { mime: PDF_MIME, match: (b) => b.subarray(0, 5).toString('ascii') === '%PDF-' },
  { mime: DOCX_MIME, match: (b) => b[0] === 0x50 && b[1] === 0x4b && [3, 5, 7].includes(b[2]) },
];

export function detectMime(buffer) {
  const signature = SIGNATURES.find((item) => item.match(buffer));
  return signature ? signature.mime : null;
}

export function assertRealMime(file) {
  const detected = detectMime(file.buffer);
  if (!detected || detected !== file.mimetype) {
    throw new AppError(
      'Isi berkas tidak sesuai dengan tipe MIME yang dikirim',
      422,
      'INVALID_FILE_CONTENT',
    );
  }
  return detected;
}