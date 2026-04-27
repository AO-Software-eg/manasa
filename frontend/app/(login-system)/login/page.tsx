'use client';

export const dynamic = "force-dynamic";
import Image from 'next/image';
import Link from 'next/link';
import { Cairo } from 'next/font/google';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { api } from '../../(marketing)/hooks/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
});

function page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/user';

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

      router.push(redirect);
    } catch (err: any) {
      console.error(err);

      const message = err.response?.data?.message || 'حدث خطأ أثناء الدخول';

      toast.error(message);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-row-reverse gap-10 lg:gap-20 p-5 items-center justify-center ">
      <div className="left-sec w-full bg-[#1C1C18] p-6 rounded-lg shadow-sm shadow-[#e6d3a3] border-2 border-[#e6d3a3] gap-10 flex flex-col text-cemter ">
        <h1 className="text-4xl text-center font-bold text-[#e6d3a3]">
          تسجيل الدخول
        </h1>
        <form onSubmit={onsubmit} className={`w-full ${cairo.className}`}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#e6d3a3] mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-[#1C1C18] rounded-lg  w-full outline-none  text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3]  p-2 placeholder:opacity-70"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#e6d3a3] mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                onKeyUp={() => setShowPassword(false)}
                className="bg-[#1C1C18] rounded-lg w-full  outline-none  text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70"
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
              <a href="/forgot-password" className="text-[#e6d3a3] underline">
                إعادة تعيين
              </a>
            </span>
          </div>
          <button
            type="submit"
            className="bg-[#e6d3a3] w-full text-[#1C1C18] rounded-lg font-bold py-2 px-4  hover:bg-[#d4c090] transition duration-200"
          >
            تسجيل الدخول
          </button>
          <span className="text-sm text-[#e6d3a3] mt-4 block">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-[#e6d3a3] underline">
              إنشاء حساب
            </Link>
          </span>
        </form>
      </div>
      <div className="right-sec w-full hidden lg:block">
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpgf6RiFw36KrGuXiUhxb1d9ywkNe7cSPIOfET"
          alt="Login Image"
          width={800}
          height={800}
          className="w-full h-auto "
        />
      </div>
    </section>
  );
}

export default page;
