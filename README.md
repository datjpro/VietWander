# VietWander

VietWander - Lang thang Việt Nam.

## Cấu trúc repo

- `frontend/`: ứng dụng Expo Router cho mobile và web
- `backend/`: API Node/Express tách riêng cho dữ liệu và service layer
- `UI/`: mock HTML + screenshot dùng làm design source
- `PROJECT.md`: blueprint sản phẩm và kỹ thuật

## Chạy dự án

```bash
npm install --cache .npm-cache
npm run dev:web
npm run dev:api
```

## Lệnh chính

- `npm run dev:web`: chạy UI trên web bằng Expo
- `npm run dev:mobile`: chạy UI cho mobile/dev server Expo
- `npm run dev:api`: chạy backend local tại `http://localhost:4000`
- `npm run typecheck`: kiểm tra TypeScript cho cả FE và BE