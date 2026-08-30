import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-slate-400 mb-8">
          That page doesn&apos;t exist. Contact is on the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
