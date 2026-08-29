/** Render một khối JSON-LD structured data. Dữ liệu truyền vào phải do chính app tạo ra (không lấy từ input người dùng). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
