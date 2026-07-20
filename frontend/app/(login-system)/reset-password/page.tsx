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

const GOLD = '#e6d3a3';
const BG = '#1C1C18';

const inputCls = `rounded-lg bg-[${BG}] w-full outline-none text-[${GOLD}] placeholder:text-[${GOLD}] border-2 border-[${GOLD}] p-2 placeholder:opacity-70`;
const btnPrimaryCls = `bg-[${GOLD}] text-[${BG}] font-bold py-2 px-5 rounded-lg hover:bg-[#d4c090] transition duration-200`;

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

    console.log('handleSubmit called');
    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
    console.log('token:', token);

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
        className={`min-h-screen flex items-center justify-center bg-[${BG}] text-[${GOLD}] p-6 ${cairo.className}`}
      >
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col gap-4 items-center text-center py-2">
            <div className="flex items-center gap-2 w-48 h-48">
              <Lottie
                animationData={require('../../../public/successAnim.json')}
                loop
                autoplay
              />
            </div>
            <p className={`text-[${GOLD}] text-lg font-bold`}> تم إعادة تعيين كلمة المرور بنجاح!</p>
            <button
              onClick={() => router.push('/login')}
              className={`${btnPrimaryCls} w-full`}
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen mt-15 flex items-center justify-center bg-[${BG}] text-[${GOLD}] p-6 ${cairo.className}`}
    >
      <div className="w-full max-w-md space-y-6">
        <div
          className={`bg-[${BG}] p-6 rounded-lg shadow-sm shadow-[${GOLD}] border-2 border-[${GOLD}] flex flex-col gap-6`}
        >
          <h2 className="text-2xl text-center font-bold text-[${GOLD}]">
            إعادة تعيين كلمة المرور
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={`block text-[${GOLD}] mb-2`}>كلمة المرور الجديدة</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                className={inputCls}
              />
            </div>
            <div>
              <label className={`block text-[${GOLD}] mb-2`}>تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                className={inputCls}
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            <button
              type="submit"
              className={`${btnPrimaryCls} w-full`}
              disabled={loading}
            >
              {loading ? 'جارٍ...' : 'إعادة تعيين كلمة المرور'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
