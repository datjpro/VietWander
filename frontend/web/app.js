import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@19';
import { createRoot } from 'https://esm.sh/react-dom@19/client';
import htm from 'https://esm.sh/htm@3.1.1';
import {
  createDemoCheckin,
  ensureUserProfile,
  fallbackCollectionImage,
  fallbackImage,
  formatCompactNumber,
  formatDate,
  getLevelTitle,
  loginWithEmail,
  logoutCurrentUser,
  observeAuth,
  registerWithEmail,
  subscribeCollection,
  subscribeLeaderboard,
  subscribePosts,
  subscribeProfile,
} from './firebase.js';

const html = htm.bind(React.createElement);

function Message({ text, type = '' }) {
  return html`<p className=${`helper${type ? ` ${type}` : ''}`}>${text || ''}</p>`;
}

function FeedCard({ post }) {
  return html`
    <article className="feed-card">
      <p className="eyebrow">${post.hashtag || '#VietWanderCheckin'}</p>
      <h3>${post.authorName || 'VietWander Explorer'}</h3>
      <div className="feed-meta">
        <span>${post.landmarkName || 'Điểm check-in'}, ${post.provinceName || 'Việt Nam'}</span>
        <span>${formatCompactNumber(post.likeCount || 0)} ❤️ · ${formatCompactNumber(post.commentCount || 0)} 💬</span>
      </div>
      <img alt=${post.landmarkName || 'check-in'} src=${post.imageUrl || fallbackImage} />
      <p className="muted mt-12">${post.caption || 'Bài viết chưa có caption.'}</p>
    </article>
  `;
}

function RankCard({ entry, rank }) {
  return html`
    <article className="rank-card">
      <div className="rank-left">
        <div className="rank-badge">${rank}</div>
        <div>
          <h3>${entry.displayName || 'Du khách mới'}</h3>
          <p className="muted">${entry.levelTitle || getLevelTitle(entry.visitedProvinceCount || 0)}</p>
        </div>
      </div>
      <strong>${entry.visitedProvinceCount || 0}/63</strong>
    </article>
  `;
}

function CollectionCard({ item }) {
  return html`
    <article className="collection-card">
      <p className="eyebrow">${item.provinceId || 'province'}</p>
      <h3>${item.provinceName || 'Địa danh mới'}</h3>
      <p className="muted">Check-in gần nhất: ${formatDate(item.createdAt)}</p>
      <img alt=${item.provinceName || 'check-in'} src=${item.imageUrl || fallbackCollectionImage} />
    </article>
  `;
}

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [collection, setCollection] = useState([]);
  const [authForm, setAuthForm] = useState({ displayName: '', email: '', password: '' });
  const [authMessage, setAuthMessage] = useState({ text: '', type: '' });
  const [demoMessage, setDemoMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const unsubscribePosts = subscribePosts(setPosts, () => setPosts([]));
    const unsubscribeLeaderboard = subscribeLeaderboard(setLeaderboard, () => setLeaderboard([]));

    return () => {
      unsubscribePosts();
      unsubscribeLeaderboard();
    };
  }, []);

  useEffect(() => {
    let unsubscribeProfile = () => {};
    let unsubscribeCollection = () => {};

    const unsubscribeAuth = observeAuth(async (nextUser) => {
      setUser(nextUser);
      unsubscribeProfile();
      unsubscribeCollection();

      if (!nextUser) {
        setProfile(null);
        setCollection([]);
        return;
      }

      await ensureUserProfile(nextUser);
      unsubscribeProfile = subscribeProfile(nextUser.uid, setProfile, () => setProfile(null));
      unsubscribeCollection = subscribeCollection(nextUser.uid, setCollection, () => setCollection([]));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
      unsubscribeCollection();
    };
  }, []);

  const groupedCollection = useMemo(() => {
    const grouped = new Map();

    [...collection]
      .sort((left, right) => {
        const leftTime = left.createdAt?.toDate ? left.createdAt.toDate().getTime() : 0;
        const rightTime = right.createdAt?.toDate ? right.createdAt.toDate().getTime() : 0;
        return rightTime - leftTime;
      })
      .forEach((item) => {
        if (!grouped.has(item.provinceId)) {
          grouped.set(item.provinceId, item);
        }
      });

    return [...grouped.values()];
  }, [collection]);

  const stats = {
    visitedProvinceCount: profile?.visitedProvinceCount || 0,
    verifiedCheckinCount: profile?.verifiedCheckinCount || 0,
    levelTitle: profile?.levelTitle || 'Du khách',
  };

  const handleChange = (field) => (event) => {
    setAuthForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setAuthMessage({ text: 'Đang đăng nhập...', type: 'success' });
      await loginWithEmail(authForm);
      setAuthMessage({ text: 'Đăng nhập thành công.', type: 'success' });
    } catch (error) {
      setAuthMessage({ text: error.message, type: 'error' });
    }
  };

  const handleRegister = async () => {
    try {
      setAuthMessage({ text: 'Đang tạo tài khoản...', type: 'success' });
      await registerWithEmail(authForm);
      setAuthMessage({ text: 'Tạo tài khoản thành công.', type: 'success' });
    } catch (error) {
      setAuthMessage({ text: error.message, type: 'error' });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutCurrentUser();
      setAuthMessage({ text: 'Bạn đã đăng xuất.', type: 'success' });
    } catch (error) {
      setAuthMessage({ text: error.message, type: 'error' });
    }
  };

  const handleDemoCheckin = async () => {
    if (!user) {
      setDemoMessage({ text: 'Bạn cần đăng nhập trước khi tạo check-in demo.', type: 'error' });
      return;
    }

    try {
      setDemoMessage({ text: 'Đang tạo check-in demo...', type: 'success' });
      await createDemoCheckin(user);
      setDemoMessage({ text: 'Đã tạo check-in demo vào Firestore.', type: 'success' });
    } catch (error) {
      setDemoMessage({ text: error.message, type: 'error' });
    }
  };

  return html`
    <div className="shell">
      <aside className="sidebar card">
        <div>
          <p className="eyebrow">Frontend Web React</p>
          <h1>VietWander Dashboard</h1>
          <p className="muted">
            Web riêng bằng React JS để quản trị nhanh feed cộng đồng, leaderboard và bộ sưu tập check-in qua Firebase.
          </p>
        </div>

        <div className="status-list">
          <div className="status-item">
            <span>Firebase project</span>
            <strong>vietwander-fdf99</strong>
          </div>
          <div className="status-item">
            <span>Auth trạng thái</span>
            <strong>${user ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</strong>
          </div>
          <div className="status-item">
            <span>Người dùng hiện tại</span>
            <strong>${user?.email || 'Chưa đăng nhập'}</strong>
          </div>
        </div>

        <section className="card auth-card">
          <h2>Đăng nhập / đăng ký</h2>
          <form className="form-grid" onSubmit=${handleLogin}>
            <label>
              Tên hiển thị
              <input onInput=${handleChange('displayName')} placeholder="Nhà thám hiểm Việt Nam" type="text" value=${authForm.displayName} />
            </label>
            <label>
              Email
              <input onInput=${handleChange('email')} placeholder="hello@vietwander.vn" required type="email" value=${authForm.email} />
            </label>
            <label>
              Mật khẩu
              <input onInput=${handleChange('password')} placeholder="••••••••" required type="password" value=${authForm.password} />
            </label>
            <div className="button-row">
              <button type="submit">Đăng nhập</button>
              <button className="secondary" onClick=${handleRegister} type="button">Đăng ký</button>
              <button className="ghost" onClick=${handleLogout} type="button">Đăng xuất</button>
            </div>
            <${Message} text=${authMessage.text} type=${authMessage.type} />
          </form>
        </section>

        <section className="card demo-card">
          <h2>Check-in demo</h2>
          <p className="muted">
            Tạo thử một check-in Đà Nẵng để kiểm tra Firestore realtime giữa web React và mobile Expo.
          </p>
          <button className="primary-block" onClick=${handleDemoCheckin} type="button">Tạo check-in demo</button>
          <${Message} text=${demoMessage.text} type=${demoMessage.type} />
        </section>
      </aside>

      <main className="content">
        <section className="hero card">
          <div>
            <p className="eyebrow">React + Firebase</p>
            <h2>Web workspace giờ là React JS độc lập</h2>
            <p className="muted">
              Dùng component React để tách web riêng khỏi mobile, sẵn sàng mở rộng dashboard admin, moderation và analytics.
            </p>
          </div>
          <div className="hero-stats">
            <div>
              <span>Tỉnh đã mở khóa</span>
              <strong>${stats.visitedProvinceCount}</strong>
            </div>
            <div>
              <span>Check-in xác thực</span>
              <strong>${stats.verifiedCheckinCount}</strong>
            </div>
            <div>
              <span>Level</span>
              <strong>${stats.levelTitle}</strong>
            </div>
          </div>
        </section>

        <section className="grid-two">
          <section className="card section-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">Realtime feed</p>
                <h3>Ảnh check-in mới nhất</h3>
              </div>
              <span className="pill">posts / createdAt desc</span>
            </div>
            <div className="list">
              ${posts.length ? posts.map((post) => html`<${FeedCard} key=${post.id} post=${post} />`) : html`<p className="muted">Chưa có bài đăng nào trong 
                <code>posts</code>.
              </p>`}
            </div>
          </section>

          <section className="card section-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">Leaderboard</p>
                <h3>Top người dùng</h3>
              </div>
              <span className="pill">users / visitedProvinceCount</span>
            </div>
            <div className="list">
              ${leaderboard.length
                ? leaderboard.map((entry, index) => html`<${RankCard} entry=${entry} key=${entry.id} rank=${index + 1} />`)
                : html`<p className="muted">Chưa có dữ liệu <code>users</code> để xếp hạng.</p>`}
            </div>
          </section>
        </section>

        <section className="card section-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">My collection</p>
              <h3>Bộ sưu tập check-in của tôi</h3>
            </div>
            <span className="pill">checkins / userId</span>
          </div>
          <div className="collection-grid">
            ${!user
              ? html`<p className="muted">Đăng nhập để xem check-in cá nhân.</p>`
              : groupedCollection.length
                ? groupedCollection.map((item) => html`<${CollectionCard} item=${item} key=${item.id} />`)
                : html`<p className="muted">Bạn chưa có check-in nào. Hãy tạo một check-in demo.</p>`}
          </div>
        </section>
      </main>
    </div>
  `;
}

createRoot(document.getElementById('root')).render(html`<${App} />`);
