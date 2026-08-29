import type { Laptop } from "@/types/laptop";
import { ProductCard } from "@/components/product/ProductCard";

export function SimilarProducts({ laptops }: { laptops: Laptop[] }) {
  if (laptops.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {laptops.map((l) => (
        <ProductCard key={l.id} laptop={l} />
      ))}
    </div>
  );
}
