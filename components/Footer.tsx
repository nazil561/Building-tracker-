export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-white/40">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p>TN Permit Readiness Checker · Built on TNCDBR 2019</p>
          <p className="text-xs">Not legal advice · Verify with your local body</p>
        </div>
      </div>
    </footer>
  );
}
