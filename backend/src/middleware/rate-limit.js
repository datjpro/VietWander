const buckets = new Map();

function cleanupBucket(bucket, windowMs) {
  const cutoff = Date.now() - windowMs;
  bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp > cutoff);
}

export function createRateLimitMiddleware({ keyPrefix = 'global', max = 60, windowMs = 60_000 } = {}) {
  return (req, res, next) => {
    const clientKey = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const bucketKey = `${keyPrefix}:${clientKey}`;
    const existingBucket = buckets.get(bucketKey) || { timestamps: [] };

    cleanupBucket(existingBucket, windowMs);
    existingBucket.timestamps.push(Date.now());
    buckets.set(bucketKey, existingBucket);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - existingBucket.timestamps.length)));

    if (existingBucket.timestamps.length > max) {
      res.status(429).json({
        message: 'Bạn gửi quá nhiều request trong thời gian ngắn. Vui lòng thử lại sau.'
      });
      return;
    }

    next();
  };
}
