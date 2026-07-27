export function Footer() {
  return (
    <footer className="border-t-2 border-crt-border-dim bg-crt-bg/90 mt-12">
      <div className="mx-auto max-w-6xl px-4 py-6 font-mono text-xs text-crt-text-dim">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <span className="text-crt-accent">root@mtk</span> v1.0 — RETRO TERMINAL
            EDITION
          </span>
          <span>
            SYS_OK <span className="text-crt-accent">●</span>{' '}
            {new Date().getFullYear()} — NO RIGHTS RESERVED
          </span>
        </div>
      </div>
    </footer>
  );
}
