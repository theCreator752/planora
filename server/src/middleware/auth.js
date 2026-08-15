const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Verifies the Bearer access token and attaches the authenticated user's id
 * as req.userId. Does not hit the DB unless downstream handlers need to.
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const payload = verifyAccessToken(token);
    req.userId = payload.sub;

    // Guard against tokens issued for a since-deleted user.
    const exists = await User.exists({ _id: req.userId });
    if (!exists) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid access token' });
  }
}

module.exports = { requireAuth };
