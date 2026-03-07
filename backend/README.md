# Backend

Backend là API layer tách riêng khỏi UI để phục vụ các nhu cầu sau:

- health check và local API cho web/mobile
- mock endpoint giai đoạn đầu
- chỗ để chuyển dần sang Firebase Admin hoặc service riêng sau này

## Chạy local

```bash
npm run dev:api
```

## Endpoint hiện có

- `GET /health`
- `GET /api/provinces`
- `GET /api/provinces/:provinceId`
- `GET /api/feed`