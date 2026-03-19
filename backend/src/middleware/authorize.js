import { forbidden, unauthorized } from '../lib/http-error.js';

export function requireAuth(req, _res, next) {
  if (!req.auth?.uid) {
    return next(unauthorized('Bạn cần đăng nhập để dùng API này.'));
  }

  return next();
}

export function requireAdmin(req, _res, next) {
  if (!req.auth?.uid) {
    return next(unauthorized('Bạn cần đăng nhập để dùng API này.'));
  }

  if (!req.auth.roles?.includes('admin')) {
    return next(forbidden('Chỉ admin mới được phép thực hiện thao tác này.'));
  }

  return next();
}

export function requireAnyRole(roles = []) {
  return (req, _res, next) => {
    if (!req.auth?.uid) {
      return next(unauthorized('Bạn cần đăng nhập để dùng API này.'));
    }

    if (!roles.some((role) => req.auth.roles?.includes(role))) {
      return next(forbidden('Bạn không có quyền thực hiện thao tác này.'));
    }

    return next();
  };
}

export function requireSelfOrAdmin(paramName = 'userId') {
  return (req, _res, next) => {
    if (!req.auth?.uid) {
      return next(unauthorized('Bạn cần đăng nhập để dùng API này.'));
    }

    const targetUserId = req.params?.[paramName];
    if (req.auth.uid === targetUserId || req.auth.roles?.includes('admin')) {
      return next();
    }

    return next(forbidden('Bạn chỉ có thể thao tác trên tài khoản của chính mình.'));
  };
}

export function assertSelfOrAdmin(req, targetUserId) {
  if (!targetUserId) {
    return;
  }

  if (!req.auth?.uid) {
    throw unauthorized('Bạn cần đăng nhập để dùng API này.');
  }

  if (req.auth.uid !== targetUserId && !req.auth.roles?.includes('admin')) {
    throw forbidden('Bạn chỉ có thể đọc dữ liệu của chính mình.');
  }
}
