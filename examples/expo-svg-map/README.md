# Expo SVG Map Sample

## Mục tiêu

Mẫu này minh họa cách dựng bản đồ Việt Nam hoạt họa trong `React Native + Expo` bằng `react-native-svg` để:

- click từng tỉnh
- highlight tỉnh được chọn
- phân màu theo trạng thái sưu tập
- pinch zoom và pan

## Gói cần cài

```bash
npx expo install react-native-svg react-native-reanimated react-native-gesture-handler
```

## Cách dùng

1. Copy file `InteractiveVietnamMap.tsx` vào màn hình hoặc component trong app Expo.
2. Thay mảng `PROVINCES` bằng dữ liệu path thật xuất từ Figma hoặc Illustrator.
3. Map `status` với dữ liệu Firestore như:
   - `locked`: chưa mở
   - `discover`: đã lưu muốn đi
   - `visited`: đã check-in thường
   - `verified`: check-in GPS hợp lệ

## Cách scale lên 63 tỉnh

- Thiết kế illustrator map với mỗi tỉnh là 1 path riêng.
- Export SVG.
- Tách từng `d` path vào file data TypeScript.
- Gắn `id`, `name`, `centroid`, `provinceCode` cho mỗi tỉnh.
- Khi user tap, gọi bottom sheet hoặc navigate vào màn hình tỉnh.

## Khi nào nên chuyển sang Mapbox

Chỉ nên dùng `@rnmapbox/maps` nếu bạn cần:

- geospatial layer phức tạp
- route overlay thật
- camera control mạnh
- clustering nhiều điểm động

Với bản đồ hoạt họa phong cách minh họa, `react-native-svg` thường phù hợp hơn cho MVP.
