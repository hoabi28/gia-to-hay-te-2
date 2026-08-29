"use client";

export function DeleteLaptopButton({
  laptopName,
  action,
}: {
  laptopName: string;
  action: () => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Xoá vĩnh viễn "${laptopName}"? Không thể hoàn tác.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        Xoá laptop này
      </button>
    </form>
  );
}
