import { formatCompactNumber, formatDate } from '../lib/utils.js';
import { useI18n } from '../providers/I18nProvider.jsx';

export function PostCard({ post }) {
  const { t } = useI18n();

  return (
    <article className="post-card">
      <img
        src={post.photoUrl || post.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'}
        alt={post.landmarkName || post.provinceName || t('post.fallbackImageAlt')}
      />
      <div className="post-card-body">
        <div className="post-card-headline">
          <div>
            <p className="eyebrow">{post.hashtag || '#VietWanderCheckin'}</p>
            <h3>{post.landmarkName || post.provinceName || t('post.fallbackTitle')}</h3>
          </div>
          <span className="pill">{formatDate(post.createdAt)}</span>
        </div>
        <p className="muted-copy">{post.caption || t('post.emptyCaption')}</p>
        <div className="post-meta-row">
          <span>
            {post.authorName || t('post.fallbackAuthor')} · {post.provinceName || t('post.fallbackProvince')}
          </span>
          <span>
            {formatCompactNumber(post.likesCount || post.likeCount || 0)} ❤️ · {formatCompactNumber(post.commentsCount || post.commentCount || 0)} 💬
          </span>
        </div>
      </div>
    </article>
  );
}
