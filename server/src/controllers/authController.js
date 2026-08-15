const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const SALT_ROUNDS = 12;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Validation failed', details: errors.array() });
    return true;
  }
  return false;
}

async function issueTokenPair(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokens.push(hashToken(refreshToken));
  // Keep the list bounded so it doesn't grow forever across devices/sessions.
  if (user.refreshTokens.length > 10) {
    user.refreshTokens = user.refreshTokens.slice(-10);
  }
  await user.save();

  return { accessToken, refreshToken };
}

async function signup(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });

    const tokens = await issueTokenPair(user);

    res.status(201).json({ user: user.toSafeJSON(), ...tokens });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash +refreshTokens'
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokens = await issueTokenPair(user);

    res.json({ user: user.toSafeJSON(), ...tokens });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(payload.sub).select('+refreshTokens');
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const incomingHash = hashToken(refreshToken);
    if (!user.refreshTokens.includes(incomingHash)) {
      // Token isn't recognized (already used / logged out / stale) — reject.
      return res.status(401).json({ error: 'Refresh token not recognized' });
    }

    // Rotate: invalidate the used refresh token, issue a fresh pair.
    user.refreshTokens = user.refreshTokens.filter((t) => t !== incomingHash);
    const tokens = await issueTokenPair(user);

    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      // Nothing to invalidate server-side; client should still drop its tokens.
      return res.status(204).send();
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(204).send();
    }

    const user = await User.findById(payload.sub).select('+refreshTokens');
    if (user) {
      const incomingHash = hashToken(refreshToken);
      user.refreshTokens = user.refreshTokens.filter((t) => t !== incomingHash);
      await user.save();
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * Stubbed password reset request. In production this would email a link
 * containing the raw token; here we log it and return it in dev mode only
 * so the flow is testable end-to-end without an email provider wired up.
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond the same way whether or not the user exists, so this
    // endpoint can't be used to enumerate registered emails.
    const genericResponse = {
      message: 'If an account with that email exists, a reset link has been sent.',
    };

    if (!user) {
      return res.json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = hashToken(rawToken);
    const minutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 30);
    user.resetPasswordExpires = new Date(Date.now() + minutes * 60 * 1000);
    await user.save();

    // Placeholder for real email delivery (e.g. via SES/SendGrid/etc).
    console.log(`[password reset] token for ${user.email}: ${rawToken}`);

    const payload = { ...genericResponse };
    if (process.env.NODE_ENV !== 'production') {
      payload.devResetToken = rawToken; // convenience for local testing only
    }

    res.json(payload);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'token and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'newPassword must be at least 8 characters' });
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordTokenHash +resetPasswordExpires +refreshTokens');

    if (!user) {
      return res.status(400).json({ error: 'Reset token is invalid or has expired' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    // Invalidate all existing sessions on password change.
    user.refreshTokens = [];
    await user.save();

    res.json({ message: 'Password has been reset. Please log in again.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
