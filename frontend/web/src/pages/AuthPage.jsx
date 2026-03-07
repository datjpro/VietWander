import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';

const authArt = {
  login:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAnKJ-QMgeTbcSKUdLRs-XQi_BQGRT_kr1eZ5TToNkLN_TEOyjWXO7TDy9uNTLLB18Z3FcfegLRqJ5mhqUW_0U3UP3nN4eK0FSj9LiUNtKNiiVFGne-IMuwETc31QlfJue5Adz4mR9eH1psW9v5DxaAcbQI2vzYWlzor5elmk9-Z8h2lVIRaw79kjSXE80Jd8QF8gchXGjynamfcmijP7EGbZGbX_Q1QJKLRbimjwKd-Zrf1MMnoZVX8M8qZzuLH9oTTHVzHsglgPN7',
  register:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPFt8o0KXdcVK4cVBqoVQz0r-fj79J-wyq6LwACFu5teyorRCWuWdKs46TuziHksRooqLFF1m3AdYaUbhG9XGqSLVvJ9DZQkoHSwK_FPXDMmV_pCiLjJ5IQ42IG2rD2kabK7-xXmC3cGuAzqxRIZBpdDQMA6_33jq2Rb_153a12Q3TtvNgRWopW0nT_goEJemMiCiCKu-fOZA9N8XhBe-FRhkjo9OGdTKhbFWXgQ343i9JujOFablLMhjpLO-SFYFtf1jNPkJADA8'
};

export function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const title = isRegister ? 'Tạo tài khoản VietWander' : 'Đăng nhập VietWander';
  const description = isRegister
    ? 'Bắt đầu sưu tập các tỉnh đã đến và đồng bộ check-in trên web/mobile.'
    : 'Đăng nhập để xem bộ sưu tập, bảng xếp hạng và tạo check-in mới.';

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      displayName: String(formData.get('displayName') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    };

    try {
      if (isRegister) {
        await register(values);
      } else {
        await login(values);
      }
      navigate('/');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Xác thực thất bại.');
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-visual-panel">
        <div className="auth-visual-copy">
          <p className="eyebrow">React Web Experience</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <img alt="VietWander illustration" src={authArt[mode]} />
      </section>

      <section className="auth-card">
        <div>
          <p className="brand-script">VietWander</p>
          <h2>{isRegister ? 'Bắt đầu khám phá' : 'Chào mừng quay lại'}</h2>
          <p className="muted-copy">UI này được viết lại bằng React JS chuẩn, không còn bản static ESM cũ.</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {isRegister ? (
            <label>
              Tên hiển thị
              <input className="input-field" name="displayName" placeholder="Tô Phạm Thành Đạt" required />
            </label>
          ) : null}
          <label>
            Email
            <input className="input-field" name="email" placeholder="dat@example.com" required type="email" />
          </label>
          <label>
            Mật khẩu
            <input className="input-field" name="password" placeholder="••••••••" required type="password" />
          </label>
          <button className="button primary-button full-width" type="submit">
            {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
          </button>
        </form>

        <p className="muted-copy compact-copy">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <Link className="inline-link" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </Link>
        </p>
      </section>
    </div>
  );
}
