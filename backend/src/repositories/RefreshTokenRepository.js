import { BaseRepository } from '../core/BaseRepository.js';

export class RefreshTokenRepository extends BaseRepository {
  constructor() {
    super({
      table: 'refresh_tokens',
      sortable: ['expires_at', 'created_at', 'id'],
      filters: { user_id: 'user_id', token_hash: 'token_hash' },
      softDelete: false,
      defaultSort: 'created_at',
    });
  }

  async createToken(userId, tokenHash, expiresAt) {
    return this.insert({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt });
  }

  async findUsableByHash(tokenHash) {
    return this.execute(
      `SELECT * FROM refresh_tokens
       WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash],
    ).then((rows) => rows[0] ?? null);
  }

  async revokeByHash(tokenHash) {
    return this.execute('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [
      tokenHash,
    ]);
  }

  async revokeAllForUser(userId) {
    return this.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
      [userId],
    );
  }

  async purgeExpired() {
    return this.execute('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
  }
}