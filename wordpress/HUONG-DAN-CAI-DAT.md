# Landing HR Global – Cài đặt WordPress

Template **dùng Header/Footer của theme** site HR Global — chỉ phần giữa là nội dung landing.

## Upload vào theme

```text
wp-content/themes/themename/
├── page-landing-hr-global.php
└── landing-hr/
    ├── styles.css
    ├── script.js
    └── assets/
```

## Cách làm

1. Upload 2 mục trên vào **theme đang active** (ví dụ thư mục `themename`).
2. **Trang → Thêm mới** (hoặc sửa trang) → đặt tiêu đề trang.
3. Cột bên phải → **Mẫu / Template** → chọn **Landing HR Global**.
4. **Không cần** dán HTML vào ô nội dung trang.
5. Xuất bản / Cập nhật.

Trang sẽ hiện: **Header theme → nội dung landing → Footer theme**.

## Lưu ý

- Không dùng ô “Custom HTML / chèn mã” trong editor — phải chọn **Template**.
- CSS/JS landing đã được giới hạn trong khối `.hr-landing`, hạn chế ảnh hưởng header/footer theme.
- Nếu sau khi up vẫn không thấy template: kiểm tra đã upload đúng theme đang bật, rồi F5 lại trang chỉnh sửa.
