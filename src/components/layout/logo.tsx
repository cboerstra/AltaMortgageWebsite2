import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="Alta Mortgage Group Home">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18 2L32 30H4L18 2Z" fill="#003087" opacity="0.2" />
        <path d="M18 8L28 28H8L18 8Z" fill="#003087" opacity="0.4" />
        <path d="M18 14L24 26H12L18 14Z" fill="#003087" />
        <path d="M18 2L20 6L18 8L16 6L18 2Z" fill="#00A86B" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold text-navy tracking-tight">Alta</span>
        <span className="text-xs font-normal text-navy-light tracking-wide">Mortgage Group</span>
      </div>
    </Link>
  );
}
