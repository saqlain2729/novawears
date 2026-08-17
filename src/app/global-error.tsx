"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 bg-paper text-ink">
          <p className="font-display text-2xl mb-3">Something went wrong.</p>
          <p className="text-silver-dark mb-8 text-sm">Please try again, or contact us if the problem continues.</p>
          <button onClick={reset} className="bg-ink text-paper px-8 py-3.5 text-[12px] tracking-widest2 uppercase">
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
