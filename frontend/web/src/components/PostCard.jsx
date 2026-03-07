import { formatCompactNumber, formatDate } from '../lib/utils.js';

export function PostCard({ post }) {
  return (
    <article className="post-card">
      <img
        src={post.photoUrl || post.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'}
        alt={post.landmarkName || post.provinceName || 'Ảnh check-in'}
      />
      <div className="post-card-body">
        <div className="post-card-headline">
          <div>
            <p className="eyebrow">{post.hashtag || '#VietWanderCheckin'}</p>
            <h3>{post.landmarkName || post.provinceName || 'Điểm check-in'}</h3>
          </div>
          <span className="pill">{formatDate(post.createdAt)}</span>
        </div>
        <p className="muted-copy">{post.caption || 'Chưa có mô tả cho check-in này.'}</p>
        <div className="post-meta-row">
          <span>{post.authorName || 'Traveler'} · {post.provinceName || 'Việt Nam'}</span>
          <span>{formatCompactNumber(post.likesCount || post.likeCount || 0)} ❤️ · {formatCompactNumber(post.commentsCount || post.commentCount || 0)} 💬</span>
        </div>
      </div>
    </article>
  );
}
