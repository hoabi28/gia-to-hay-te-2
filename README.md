# Giá Tốt Hay Tệ

Website so sánh và chọn laptop dành cho người dùng Việt Nam — giúp tìm laptop phù hợp với
ngân sách và nhu cầu thực tế mà không cần tự đọc nhiều bảng thông số hay bài review, và biết
ngay mức giá đang thấy là **giá tốt hay tệ** so với mặt bằng chung.

Có **trang quản trị (`/admin`)** để tự cập nhật giá, thông tin máy, thêm/xoá laptop mà không
cần sửa code hay build lại — dữ liệu lưu trong database Postgres thật, không còn là file tĩnh.

## Công nghệ sử dụng

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) + React 19
- TypeScript, Tailwind CSS v4
- [Prisma ORM 7](https://www.prisma.io) + Postgres (Prisma Postgres) — lưu dữ liệu laptop, giá, review
- Xác thực admin tối giản tự viết (1 mật khẩu dùng chung, cookie ký HMAC), không dùng thư viện auth ngoài

## Cài đặt và chạy dự án

Yêu cầu Node.js ≥ 18.18 và 1 database Postgres (xem mục "Database" bên dưới).

```bash
npm install
```

Tạo file `.env` (copy từ `.env.example`) và điền:

```
DATABASE_URL=...        # connection string Postgres
ADMIN_PASSWORD=...      # mật khẩu đăng nhập /admin
SESSION_SECRET=...      # chuỗi ngẫu nhiên để ký cookie phiên đăng nhập
```

Đẩy schema lên database và nạp dữ liệu mẫu (15 laptop) lần đầu:

```bash
npx prisma db push
npm run db:seed
```

Chạy dev server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) cho trang công khai, và
[http://localhost:3000/admin](http://localhost:3000/admin) cho trang quản trị.

Các lệnh khác:

```bash
npm run build       # build production (Node.js server, không phải static export)
npm run lint         # kiểm tra lỗi ESLint
npm run db:seed      # nạp lại dữ liệu mẫu (an toàn chạy nhiều lần, dùng upsert)
npm run db:studio    # mở Prisma Studio — xem/sửa dữ liệu trực tiếp qua giao diện
```

## Database

Dự án dùng [Prisma Postgres](https://www.prisma.io/postgres) (đã tạo sẵn 1 database lúc phát
triển). Nếu bạn muốn tự tạo database riêng, có 2 lựa chọn:

- **Prisma Postgres**: vào [console.prisma.io](https://console.prisma.io) → tạo project mới →
  copy connection string dạng `postgres://...@db.prisma.io:5432/...`
- **Bất kỳ Postgres nào khác** (Neon, Supabase, RDS…): chỉ cần connection string chuẩn, dán vào
  `DATABASE_URL`

Sau khi đổi `DATABASE_URL`, chạy lại `npx prisma db push` rồi `npm run db:seed`.

Schema định nghĩa ở [`prisma/schema.prisma`](prisma/schema.prisma), gồm 4 bảng: `Laptop`,
`StoreOffer` (giá theo từng cửa hàng), `PriceSnapshot` (lịch sử giá — mỗi lần admin lưu giá
mới sẽ tự thêm 1 điểm dữ liệu ở đây), `CommunityReview`.

## Trang quản trị (`/admin`)

- Đăng nhập bằng mật khẩu trong `ADMIN_PASSWORD`
- `/admin` — danh sách laptop, giá thấp nhất hiện tại, tình trạng tồn kho
- `/admin/laptop/[id]` — sửa toàn bộ thông tin: cơ bản, thông số kỹ thuật, điểm hiệu năng theo
  nhu cầu, điểm tiêu chí (màn hình/pin/độ bền/bảo hành), ưu-nhược điểm, và **bảng giá theo cửa
  hàng** (thêm/sửa/xoá từng dòng: tên cửa hàng, giá, phí ship, quà tặng, bảo hành, tồn kho, link)
- `/admin/laptop/new` — thêm laptop mới (tự gợi ý slug/ID từ tên, kiểm tra trùng)
- Xoá laptop có xác nhận trước khi xoá vĩnh viễn

Mỗi lần lưu, trang công khai (`/`, `/laptop`, `/laptop/[id]`, `/so-sanh`, `/sitemap.xml`) được
cập nhật **ngay lập tức** qua `revalidatePath` — không cần build lại hay khởi động lại server.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (site)/                  # Route group cho trang công khai (có Header/Footer/CompareBar)
│   │   ├── page.tsx               # Trang chủ
│   │   ├── laptop/                # Danh sách + chi tiết laptop
│   │   └── so-sanh/               # So sánh 2 laptop
│   ├── admin/
│   │   ├── login/                 # Đăng nhập admin
│   │   └── (dashboard)/           # Route group có layout riêng (header quản trị, nút đăng xuất)
│   │       ├── page.tsx             # Danh sách laptop
│   │       ├── laptop/[id]/         # Sửa laptop + Server Actions (update/delete)
│   │       └── laptop/new/          # Thêm laptop mới + Server Action (create)
│   ├── api/laptops/route.ts     # API JSON cho client component cần dữ liệu (CompareBar)
│   ├── layout.tsx                # Root layout tối giản (html/body/fonts/metadata)
│   ├── sitemap.ts, robots.ts, manifest.ts, icon.tsx, opengraph-image.tsx
│   └── not-found.tsx, error.tsx
├── middleware.ts → src/proxy.ts # Bảo vệ /admin/* (kiểm tra cookie phiên đăng nhập)
│
├── components/
│   ├── layout/                  # Header, Footer
│   ├── ui/                      # SearchBar, Tag, ValueScoreBadge, ProductImage (ảnh vector
│   │                             minh hoạ theo category), States (Loading/Empty/Error)
│   ├── product/                 # ProductCard
│   ├── list/                    # FilterPanel, LaptopListClient
│   ├── detail/                  # VerdictBox, StoreList, PriceHistoryChart, PriceIndicators,
│   │                             SpecTable, ScoreBreakdown, ReviewsSection, SimilarProducts
│   ├── compare/                 # LaptopPicker, CompareTable, CompareConclusion, CompareBar
│   └── admin/                   # LaptopForm (form dùng chung sửa/thêm), DeleteLaptopButton
│
├── data/laptops.ts              # Dữ liệu mẫu gốc — chỉ dùng làm nguồn seed ban đầu
│                                 (prisma/seed.ts import từ đây), KHÔNG dùng lúc chạy app nữa
│
├── lib/
│   ├── db.ts                     # Prisma Client singleton
│   ├── laptopRepo.ts             # getAllLaptops/getLaptopById/getSimilarLaptops (query DB,
│   │                              trả về đúng shape type `Laptop`)
│   ├── adminAuth.ts              # Ký/kiểm tra cookie phiên đăng nhập admin
│   ├── scoring.ts, price.ts, filterLaptops.ts, compareLaptops.ts, facets.ts  # Logic thuần,
│   │                              không đổi dù dữ liệu đến từ đâu
│   ├── compareStore.ts, useCompare.ts, helpfulVotes.ts   # State phía client (localStorage)
│   ├── mockPriceHistory.ts, mockStores.ts   # Chỉ dùng bởi data/laptops.ts lúc seed
│   └── format.ts, urlFilters.ts, site.ts, seo.ts
│
└── types/laptop.ts              # Type dùng chung toàn app (Laptop, StoreOffer, …)

prisma/
├── schema.prisma                # Định nghĩa 4 bảng
└── seed.ts                      # Nạp dữ liệu mẫu từ src/data/laptops.ts vào DB
```

## Logic "Điểm đáng tiền"

Công thức nằm ở [`src/lib/scoring.ts`](src/lib/scoring.ts), tính trên thang 100 từ 6 tiêu
chí với trọng số mặc định (có thể truyền `weights` khác để thử nghiệm):

| Tiêu chí | Trọng số |
| --- | --- |
| Hiệu năng theo nhu cầu (trung bình 5 nhóm tác vụ) | 35% |
| Chất lượng màn hình | 15% |
| Pin | 10% |
| Độ bền / tản nhiệt | 10% |
| Bảo hành | 10% |
| Giá hiện tại so với giá trung bình 30 ngày | 20% |

Cách tính và điểm từng tiêu chí được hiển thị minh bạch ngay trên trang chi tiết sản phẩm
(`ScoreBreakdown`), không chỉ hiển thị một con số duy nhất.

## Ghi chú triển khai

- Ảnh sản phẩm dùng **placeholder dạng vector** (`components/ui/ProductImage.tsx`), không
  dùng ảnh có bản quyền — dễ dàng thay bằng `<Image>` trỏ tới ảnh thật khi có nguồn hợp lệ.
- Danh sách "so sánh" (tối đa 2 máy) lưu ở `localStorage`, đồng bộ qua toàn app bằng
  `useSyncExternalStore`.
- Review cộng đồng nằm trong DB (bảng `CommunityReview`) nhưng **chưa có UI sửa/duyệt** trong
  trang quản trị ở bản này — vẫn là nội dung mẫu.
- Không có nhiều tài khoản admin/phân quyền — chỉ 1 mật khẩu dùng chung.
- Giá vẫn do admin **tự nhập tay**, không có crawler tự động lấy giá từ các sàn.

## SEO đã cấu hình sẵn

- `app/sitemap.ts`, `app/robots.ts` — sinh `/sitemap.xml` và `/robots.txt` tự động từ database.
- Metadata đầy đủ (title, description, canonical, OpenGraph, Twitter card) cho từng trang.
- JSON-LD structured data (`components/seo/JsonLd.tsx`, `lib/seo.ts`): `WebSite` (kèm
  `SearchAction` để có sitelinks search box), `Product` + `AggregateOffer` + review rating
  (trang chi tiết), `BreadcrumbList`.
- Ảnh OpenGraph sinh **động** bằng `next/og`, theo từng sản phẩm (tên, giá, nhãn "Giá tốt",
  điểm đáng tiền) — cập nhật ngay khi admin đổi giá vì không còn prerender tĩnh.
- Trang `/admin/*` có `robots: noindex` để Google không thu thập.

**Trước khi deploy thật**, đặt biến môi trường `NEXT_PUBLIC_SITE_URL` bằng domain thật (xem
`.env.example`) — biến này quyết định domain xuất hiện trong sitemap, canonical URL và
OpenGraph.

## Deploy

Vì có Server Actions + database, cần hosting hỗ trợ Node.js — **không dùng được static
hosting/shared hosting cPanel thông thường** (khác với bản trước khi có trang quản trị).
Khuyến nghị dùng [Vercel](https://vercel.com):

1. Push code lên GitHub, vào Vercel → Add New Project → import repo (Vercel tự nhận diện
   Next.js, không cần cấu hình build thêm).
2. Project Settings → Environment Variables → thêm `DATABASE_URL`, `ADMIN_PASSWORD`,
   `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL=https://<domain>`.
3. Project Settings → Domains → thêm domain riêng, khai báo bản ghi DNS Vercel yêu cầu
   (A/CNAME) ở nơi quản lý domain (vd PA Việt Nam) — không cần đổi nameserver.
4. Sau khi deploy lần đầu, chạy 1 lần (từ máy local, trỏ `DATABASE_URL` production):
   `npx prisma db push && npm run db:seed` để khởi tạo dữ liệu — **chỉ cần làm 1 lần**, các
   lần sau chỉnh sửa dữ liệu qua `/admin`, không cần seed lại.

## Google Search Console — sau khi đã deploy xong

1. Vào [Google Search Console](https://search.google.com/search-console), xác minh quyền sở
   hữu domain (DNS TXT record hoặc upload file HTML vào `public/`).
2. Submit `https://<domain>/sitemap.xml`.
3. (Tuỳ chọn) Gắn Google Analytics/GA4 để theo dõi traffic.
4. Kiểm tra thẻ OpenGraph bằng
   [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

> Các bước trên chỉ giúp site **được Google thu thập dữ liệu**. Để vận hành như một sản phẩm
> kinh doanh thật (hợp tác affiliate với các sàn, tuân thủ quy định về website thương mại điện
> tử tại Việt Nam…) cần thêm các bước ngoài phạm vi code.
