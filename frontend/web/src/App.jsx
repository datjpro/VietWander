import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { useAuth } from './providers/AuthProvider.jsx';
import { CheckinPage } from './pages/CheckinPage.jsx';
import { CollectionPage } from './pages/CollectionPage.jsx';
import { FeedPage } from './pages/FeedPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { ProvincePage } from './pages/ProvincePage.jsx';

function RequireAuth({ children }) {
  const { ready, user } = useAuth();

  if (!ready) {
    return <div className="page-loading">Đang tải phiên đăng nhập...</div>;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
}

function NotFoundPage() {
  return (
    <div className="page-card narrow-card centered-card">
      <p className="eyebrow">404</p>
      <h1>Không tìm thấy trang</h1>
      <p className="muted-copy">Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="province/:provinceId" element={<ProvincePage />} />
        <Route
          path="collection"
          element={
            <RequireAuth>
              <CollectionPage />
            </RequireAuth>
          }
        />
        <Route
          path="checkin"
          element={
            <RequireAuth>
              <CheckinPage />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
