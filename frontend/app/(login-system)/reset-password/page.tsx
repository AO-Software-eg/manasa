'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Cairo } from 'next/font/google';
import dynamic from 'next/dynamic';
import { api } from '@/app/hooks/api';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

const passwordSchema = z.object({
  password: z.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
});

const inputCls =
  'bg-secondary/20 rounded-xl w-full outline-none text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary p-3 transition-colors placeholder:text-sm';

const btnPrimaryCls =
  'bg-primary text-primary-foreground rounded-xl font-bold py-3 px-4 hover:bg-primary/95 transition duration-200 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    const result = passwordSchema.safeParse({ password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/reset-password', {
        resetToken: token,
        newPassword: password,
      });
      console.log('Reset password response:', response);
      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('حدث خطأ أثناء إعادة تعيين كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        dir="rtl"
        className={`min-h-screen flex items-center justify-center bg-background text-foreground p-6 ${cairo.className}`}
      >
        <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-md flex flex-col gap-4 items-center text-center">
          <div className="flex items-center gap-2 w-48 h-48">
            <Lottie
              animationData={require('../../../public/successAnim.json')}
              loop
              autoplay
            />
          </div>
          <p className="text-primary text-lg font-bold">
            تم إعادة تعيين كلمة المرور بنجاح!
          </p>
          <button
            onClick={() => router.push('/login')}
            className={`${btnPrimaryCls} w-full`}
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex items-center justify-center bg-background text-foreground p-6 ${cairo.className}`}
    >
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-md flex flex-col gap-8">
        <h2 className="text-3xl text-center font-bold text-primary">
          إعادة تعيين كلمة المرور
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground/80 mb-2">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground/80 mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              className={inputCls}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className={`${btnPrimaryCls} w-full mt-2`} disabled={loading}>
            {loading ? 'جارٍ...' : 'إعادة تعيين كلمة المرور'}
          </button>
        </form>
      </div>
    </div>
  );
}