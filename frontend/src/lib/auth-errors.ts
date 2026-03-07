export function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === 'object' && error && 'code' in error
      ? String((error as { code?: string }).code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Email chưa đúng định dạng.';
    case 'auth/missing-password':
      return 'Vui lòng nhập mật khẩu.';
    case 'auth/weak-password':
      return 'Mật khẩu cần ít nhất 6 ký tự.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email hoặc mật khẩu chưa đúng.';
    case 'auth/too-many-requests':
      return 'Bạn thử quá nhiều lần, vui lòng đợi một chút.';
    default:
      return 'Đã có lỗi xảy ra, vui lòng thử lại.';
  }
}
