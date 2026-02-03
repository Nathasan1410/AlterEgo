"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-8 text-white">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <div className="mb-4 max-w-lg rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p className="text-sm text-red-400">{error.message}</p>
        {error.digest && <p className="mt-2 text-xs text-gray-500">Error ID: {error.digest}</p>}
      </div>
      <button
        onClick={reset}
        className="rounded-lg bg-orange-600 px-6 py-2 font-medium hover:bg-orange-700"
      >
        Try again
      </button>
      <div className="mt-8 text-sm text-gray-500">
        <p>Debugging tips:</p>
        <ul className="mt-2 list-inside list-disc text-xs">
          <li>Check browser console (F12) for errors</li>
          <li>Verify environment variables in Vercel dashboard</li>
          <li>Try clearing browser cache (Ctrl+Shift+R)</li>
          <li>Check Vercel deployment logs</li>
        </ul>
      </div>
    </div>
  );
}
