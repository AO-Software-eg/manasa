'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cairo } from 'next/font/google';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/app/hooks/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
});

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/user';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const payload = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };

    try {
      // 1. login
      await api.post('/login', payload);

      // 2. verify session (VERY IMPORTANT)
      await api.get('/me');

      toast.success('تم الدخول بنجاح!');

      // 3. redirect
      router.push(redirect);
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || 'حدث خطأ أثناء الدخول';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-row-reverse gap-10 lg:gap-20 p-5 items-center justify-center">
      <div className="w-full bg-[#1C1C18] p-6 rounded-lg shadow-sm shadow-[#e6d3a3] border-2 border-[#e6d3a3] flex flex-col gap-10">
        <h1 className="text-4xl text-center font-bold text-[#e6d3a3]">
          تسجيل الدخول
        </h1>

        <form onSubmit={onsubmit} className={`w-full ${cairo.className}`}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-[#e6d3a3] mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              required
              className="bg-[#1C1C18] w-full border-2 border-[#e6d3a3] text-[#e6d3a3] p-2 rounded-lg outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[#e6d3a3] mb-2">
              كلمة المرور
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className="bg-[#1C1C18] w-full border-2 border-[#e6d3a3] text-[#e6d3a3] p-2 rounded-lg outline-none"
              />

              {showPassword ? (
                <EyeOff
                  size={20}
                  className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-[#e6d3a3]"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={20}
                  className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-[#e6d3a3]"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <span className="text-sm text-[#e6d3a3] mt-2 block">
              هل نسيت كلمة السر ؟{' '}
              <Link href="/forgot-password" className="underline">
                إعادة تعيين
              </Link>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#e6d3a3] w-full text-[#1C1C18] rounded-lg font-bold py-2 hover:bg-[#d4c090] transition"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          <span className="text-sm text-[#e6d3a3] mt-4 block">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="underline">
              إنشاء حساب
            </Link>
          </span>
        </form>
      </div>

      <div className="w-full hidden lg:block">
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpgf6RiFw36KrGuXiUhxb1d9ywkNe7cSPIOfET"
          alt="Login Image"
          width={800}
          height={800}
        />
      </div>
    </section>
  );
}