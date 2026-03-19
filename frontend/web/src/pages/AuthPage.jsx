import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useI18n } from '../providers/I18nProvider.jsx';
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
  const { demoModeEnabled, enterGuestMode, exitGuestMode, isGuest, login, register } = useAuth();
  const { t } = useI18n();

  useDocumentTitle(t(isRegister ? 'seo.register' : 'seo.login'));

  const title = t(isRegister ? 'auth.registerTitle' : 'auth.loginTitle');
  const description = t(isRegister ? 'auth.registerDescription' : 'auth.loginDescription');

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
      window.alert(error instanceof Error ? error.message : t('auth.submitError'));
    }
  }

  async function handleEnterDemo() {
    await enterGuestMode();
    navigate('/');
  }

  async function handleExitDemo() {
    await exitGuestMode();
  }

  return (
    <div className="auth-shell">
      <section className="auth-visual-panel">
        <div className="auth-visual-copy">
          <p className="eyebrow">{t('auth.demoExperience')}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <img alt={t('auth.illustrationAlt')} src={authArt[mode]} />
      </section>

      <section className="auth-card">
        <div>
          <p className="brand-script">VietWander</p>
          <h2>{isRegister ? t('auth.startExploring') : t('auth.welcomeBack')}</h2>
          <p className="muted-copy">{t('auth.helper')}</p>
        </div>

        {demoModeEnabled ? (
          <div className="auth-demo-banner">
            <div>
              <strong>{t('auth.demoReadyTitle')}</strong>
              <p className="muted-copy">{t('auth.demoReadyDescription')}</p>
            </div>
            <button className="button primary-button" onClick={handleEnterDemo} type="button">
              {t('common.enterDemoNow')}
            </button>
          </div>
        ) : null}

        <form className="form-stack" onSubmit={handleSubmit}>
          {isRegister ? (
            <label>
              {t('common.displayName')}
              <input className="input-field" name="displayName" placeholder={t('auth.displayNamePlaceholder')} required />
            </label>
          ) : null}
          <label>
            {t('common.email')}
            <input className="input-field" name="email" placeholder={t('auth.emailPlaceholder')} required type="email" />
          </label>
          <label>
            {t('common.password')}
            <input className="input-field" name="password" placeholder={t('auth.passwordPlaceholder')} required type="password" />
          </label>
          <button className="button primary-button full-width" type="submit">
            {isRegister ? t('auth.createAccount') : t('common.login')}
          </button>
        </form>

        <p className="muted-copy compact-copy">
          {isRegister ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}{' '}
          <Link className="inline-link" to={isRegister ? '/login' : '/register'}>
            {isRegister ? t('auth.loginNow') : t('auth.registerNow')}
          </Link>
        </p>

        {isGuest ? (
          <button className="button ghost-button full-width" onClick={handleExitDemo} type="button">
            {t('auth.exitGuestDemo')}
          </button>
        ) : null}
      </section>
    </div>
  );
}

