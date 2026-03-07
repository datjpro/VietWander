# VietWander Web

Web frontend đã được chuyển sang **React JS chuẩn**, tách rõ khỏi mobile và backend.

## Chạy local

- `npm run dev:web`
- `npm run build:web`
- `npm run start:web`

## Kiến trúc

- `frontend/web/src/App.jsx`: router và route guards
- `frontend/web/src/components`: layout, card, map SVG
- `frontend/web/src/pages`: home, feed, province, collection, check-in, login/register
- `frontend/web/src/lib/api.js`: gọi backend Express
- `frontend/web/src/lib/firebase.js`: Firebase Auth + Storage cho web
- `frontend/web/src/providers/AuthProvider.jsx`: state đăng nhập và sync profile

## Toolchain

- Source viết bằng React JSX thật trong `frontend/web/src`
- Build dùng `@babel/core` + `@babel/preset-react`
- Serve bằng static Node server trong `frontend/web/scripts/dev-server.mjs`

Lý do không dùng Vite ở đây: máy Windows hiện tại đang lỗi `spawn EPERM` với subprocess của bundler native, nên mình chọn pipeline thuần JS để web vẫn chạy ổn.

## Env

Copy `frontend/web/.env.example` thành `frontend/web/.env` nếu muốn override config.

Mặc định web dùng:

- backend API tại `http://localhost:4000`
- Firebase web config của dự án `vietwander-fdf99`

## Ghi chú

- Bản cũ `app.js`, `firebase.js`, `styles.css`, `scripts/`, `dist/` đã được thay bằng cấu trúc React mới.
- UI mới bám phong cách các màn trong thư mục `UI/` nhưng viết lại thành React component thực thụ.
- Dữ liệu đọc từ backend; nếu backend chưa chạy, một số màn sẽ fallback sang demo data để vẫn xem được giao diện.
