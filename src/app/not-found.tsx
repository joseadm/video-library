import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-[#181111]">Page not found</h2>
      <p className="text-sm text-[#886364]">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn btn-secondary btn-md px-4 py-2">
        Go back home
      </Link>
    </div>
  );
}
