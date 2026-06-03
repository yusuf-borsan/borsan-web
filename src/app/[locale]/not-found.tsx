import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="font-display text-7xl text-brand-600">404</div>
        <p className="mt-4 text-lg text-ink-600">
          Sayfa bulunamadı · Page not found
        </p>
        <div className="mt-8 flex justify-center gap-4 text-sm font-semibold">
          <Link href="/tr" className="rounded-sm bg-brand-600 px-5 py-2.5 text-white hover:bg-brand-700">
            Ana Sayfa
          </Link>
          <Link href="/en" className="rounded-sm px-5 py-2.5 text-ink-700 ring-1 ring-inset ring-ink-200 hover:text-brand-600">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
