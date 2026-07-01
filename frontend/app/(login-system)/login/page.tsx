'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cairo } from 'next/font/google';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { api } from '../../hooks/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';


const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
});


export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';
  const queryClient = useQueryClient();

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const payload = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };

    try {
      const res = await api.post('/login', payload, { withCredentials: true });

      toast.success('تم الدخول بنجاح!');
      await queryClient.refetchQueries({
        queryKey: ['me'],
      });

      router.push(redirect);
    } catch (err: any) {
      console.log(err.response?.data?.message);

      const message = err.response?.data?.message || 'حدث خطأ أثناء الدخول';

      toast.error(message);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-row-reverse gap-10 lg:gap-20 p-6 items-center justify-center bg-background text-foreground">
      <div className="left-sec w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-md gap-8 flex flex-col transition-all duration-300">
        <h3 className="text-3xl text-center font-bold text-primary">
          تسجيل الدخول
        </h3>
        <form onSubmit={onsubmit} className={`w-full ${cairo.className} space-y-5`}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground/80 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="name@example.com"
              className="bg-secondary/20 rounded-xl w-full outline-none text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary p-3 transition-colors placeholder:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground/80 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                placeholder="••••••••"
                className="bg-secondary/20 rounded-xl w-full outline-none text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary p-3 transition-colors placeholder:text-sm"
              />
              {showPassword ? (
                <EyeOff
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <span className="text-xs text-muted-foreground mt-2 block">
              هل نسيت كلمة السر ؟{' '}
              <Link href="/forgot-password" className="text-primary hover:underline font-semibold">
                إعادة تعيين
              </Link>
            </span>
          </div>

          <button
            type="submit"
            className="bg-primary w-full text-primary-foreground rounded-xl font-bold py-3 px-4 hover:bg-primary/95 transition duration-200 cursor-pointer shadow-sm mt-2"
          >
            تسجيل الدخول
          </button>
          
          <span className="text-sm text-muted-foreground text-center mt-4 block">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              إنشاء حساب جديد
            </Link>
          </span>
        </form>
      </div>
      <div className="right-sec w-full hidden lg:block max-w-xl">
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpgf6RiFw36KrGuXiUhxb1d9ywkNe7cSPIOfET"
          alt="Login Image"
          width={800}
          height={800}
          className="w-full h-auto object-contain opacity-85 dark:opacity-75 transition-opacity duration-300"
          priority
        />
      </div>
    </section>
  );
}


