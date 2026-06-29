'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 px-4 py-10">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-[2rem] border border-slate-200 bg-white/95 p-10 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600 dark:bg-red-950/40 dark:text-red-400">
          &#10060;
        </div>

        <div className="text-center">
          <h1 className="mb-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">Payment Failed</h1>
          <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Your payment was not completed. Please try again or contact support if the issue persists.
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.push('/home/wallet')}
            className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            Retry Payment
          </button>

          <Link
            href="/home"
            className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Go to Home
          </Link>
        </div>

        <div className="mt-8 w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Need help?</p>
          <p className="mt-2">If this keeps happening, contact our support team or check your payment details before retrying.</p>
        </div>
      </section>
    </main>
  );
}
