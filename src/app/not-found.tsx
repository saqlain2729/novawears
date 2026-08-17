import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <p className="font-display text-6xl mb-4">404</p>
      <p className="text-silver-dark mb-8">This page doesn&apos;t exist, or the product is no longer available.</p>
      <Link href="/" className="bg-ink text-paper px-8 py-3.5 text-[12px] tracking-widest2 uppercase">
        Back to Home
      </Link>
    </div>
  );
}
