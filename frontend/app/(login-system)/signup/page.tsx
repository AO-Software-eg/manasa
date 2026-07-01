'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  AsYouType,
} from 'libphonenumber-js';
import { Cairo } from 'next/font/google';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { api } from '@/app/hooks/api';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

/* ---------------- Shared style tokens (matching login page) ---------------- */
const inputCls =
  'bg-secondary/20 rounded-xl w-full outline-none text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary p-3 transition-colors placeholder:text-sm';
const labelCls = 'block text-sm font-semibold text-foreground/80 mb-2';
const errorCls = 'text-red-400 text-sm mt-1';
const btnPrimaryCls =
  'bg-primary w-full text-primary-foreground rounded-xl font-bold py-3 px-4 hover:bg-primary/95 transition duration-200 cursor-pointer shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed';
const eyeIconCls =
  'absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary transition-colors';

// ─── Page ──────────────────────────────────────────────────────────────────────

const SignupSchema = z
  .object({
    email: z.string().email('Please provide a valid email address'),
    name: z.string().min(2, 'اسم المستخدم يجب ان يكون 2 أحرف على الأقل'),
    studentPhone: z.string().min(10, 'يجب ان يكون رقم الهاتف صحيح'),
    parentPhone: z.string().min(10, 'يجب ان يكون رقم الهاتف صحيح'),
    specialization: z.string().optional(),
    governorate: z.string().min(1, 'يجب اختيار المحافظة'),
    YearCombo: z.string().min(1, 'يجب اختيار الصف الدراسي'),
    password: z.string().min(6, 'كلمة المرور يجب ان تكون 6 أحرف على الأقل'),
    confirmPassword: z.string().min(6, 'الرجاء التأكد من كلمة المرور'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })
  .refine((data) => data.studentPhone !== data.parentPhone, {
    message: 'رقم هاتف الطالب لا يمكن أن يكون نفس رقم ولي الأمر',
    path: ['parentPhone'],
  });

type Infer = z.infer<typeof SignupSchema>;

function Page() {
  const form = useForm<Infer>({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      studentPhone: '',
      specialization: '',
      parentPhone: '',
      governorate: '',
      YearCombo: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmit = async (data: Infer) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/signup', data);

      toast.success('تم إنشاء الحساب بنجاح!');
      form.reset();
      router.push('/login');
    } catch (err: any) {
      console.log(err.response?.data?.message);

      const message = err.response?.data?.message || 'حدث خطأ أثناء الدخول';

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-row-reverse gap-10 lg:gap-20 p-6 items-center justify-center bg-background text-foreground">
      <div className="left-sec w-full max-w-lg bg-card p-8 rounded-2xl border border-border shadow-md gap-8 flex flex-col transition-all duration-300">
        <h1 className="text-3xl text-center font-bold text-primary">
          إنشاء حساب
        </h1>

        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className={`flex flex-col gap-4 ${cairo.className}`}
        >
          <div>
            <label htmlFor="email" className={labelCls}>
              البريد الإلكتروني
            </label>
            <input
              {...form.register('email')}
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              className={inputCls}
            />
            {form.formState.errors.email && (
              <p className={errorCls}>{form.formState.errors.email?.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className={labelCls}>
              الاسم الكامل
            </label>
            <input
              {...form.register('name')}
              type="text"
              id="name"
              name="name"
              placeholder="مثال : عبدالله محمد"
              className={inputCls}
            />
            {form.formState.errors.name && (
              <p className={errorCls}>{form.formState.errors.name?.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>رقم هاتف الطالب</label>
            <PhoneInput
              value={form.watch('studentPhone')}
              onChange={(val) => form.setValue('studentPhone', val)}
            />

            {form.formState.errors.studentPhone && (
              <p className={errorCls}>
                {form.formState.errors.studentPhone?.message}
              </p>
            )}
          </div>

          {/* parent phone */}
          <div>
            <label className={labelCls}>رقم هاتف ولي الأمر</label>
            <PhoneInput
              value={form.watch('parentPhone')}
              onChange={(val) => form.setValue('parentPhone', val)}
            />

            {form.formState.errors.parentPhone && (
              <p className={errorCls}>
                {form.formState.errors.parentPhone?.message}
              </p>
            )}
          </div>

          {/* Governorate */}
          <div>
            <label htmlFor="governorate" className={labelCls}>
              المحافظة
            </label>
            <GovCombo
              value={form.watch('governorate')}
              onChange={(val) => form.setValue('governorate', val)}
            />
            {form.formState.errors.governorate && (
              <p className={errorCls}>
                {form.formState.errors.governorate?.message}
              </p>
            )}
          </div>
          {/* Year & specialization */}
          <div>
            <label htmlFor="year" className={labelCls}>
              الصف الدراسي
            </label>
            <YearCombo
              year={form.watch('YearCombo')}
              specialize={form.watch('specialization')}
              onSpecializationChange={(val) =>
                form.setValue('specialization', val)
              }
              onYearchange={(val) => form.setValue('YearCombo', val)}
            />
            {form.formState.errors.YearCombo && (
              <p className={errorCls}>
                {form.formState.errors.YearCombo?.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelCls}>
              كلمة المرور
            </label>
            <div className="relative">
              <input
                {...form.register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                minLength={6}
                placeholder="كلمة المرور (6 أحرف على الأقل)"
                className={inputCls}
              />
              {showPassword ? (
                <EyeOff
                  size={18}
                  className={eyeIconCls}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className={eyeIconCls}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {form.formState.errors.password && (
              <p className={errorCls}>
                {form.formState.errors.password?.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className={labelCls}>
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                {...form.register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                className={inputCls}
              />
              {showConfirmPassword ? (
                <EyeOff
                  size={18}
                  className={eyeIconCls}
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className={eyeIconCls}
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>
            {form.formState.errors.confirmPassword && (
              <p className={errorCls}>
                {form.formState.errors.confirmPassword?.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className={btnPrimaryCls}>
            {isSubmitting ? 'جارِ الإنشاء...' : 'إنشاء الحساب'}
          </button>

          <span className="text-sm text-muted-foreground text-center mt-4 block">
            لديك حساب؟{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              تسجيل الدخول
            </Link>
          </span>
        </form>
      </div>

      <div className="right-sec w-full hidden lg:block max-w-xl">
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpbQdjvm3StHrnFYB8615RChWXca7kgdwl0OMi"
          alt="Signup Image"
          width={800}
          height={800}
          className="w-full h-auto object-contain opacity-85 dark:opacity-75 transition-opacity duration-300"
          priority
        />
      </div>
    </section>
  );
}

export default Page;

function YearCombo({
  onYearchange,
  onSpecializationChange,
}: {
  year: string;
  specialize: string | undefined;
  onYearchange: (val: string) => void;
  onSpecializationChange: (val: string) => void;
}) {
  const years = ['اولى ثانوي', 'ثانية ثانوي', 'ثالثة ثانوي'];
  const specializations = ['علمي علوم', 'علمي رياضة', 'ادبي'];
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    onSpecializationChange(selectedSpecialization);
  }, [selectedSpecialization]);

  return (
    <div className="flex gap-5 items-center justify-center">
      <Combobox>
        <ComboboxInput className={inputCls} placeholder="اختر الصف الدراسي" />
        <ComboboxContent
          className={`bg-card border border-border mt-1 rounded-xl shadow-md ${cairo.className}`}
        >
          <ComboboxList>
            {years.map((year) => (
              <ComboboxItem
                key={year}
                value={year}
                onClick={() => {
                  setSelectedYear(year);
                  onYearchange(year.toString());
                }}
                className="px-3 py-2 cursor-pointer text-foreground hover:bg-secondary/20 transition-colors rounded"
              >
                {year}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {selectedYear === 'ثالثة ثانوي' || selectedYear === 'ثانية ثانوي' ? (
        <Combobox>
          <ComboboxInput
            className={`${inputCls} mt-4`}
            placeholder="اختر الشعبة"
          />
          <ComboboxContent
            className={`bg-card border border-border mt-1 rounded-xl shadow-md ${cairo.className}`}
          >
            <ComboboxList>
              {specializations.map((spec) => (
                <ComboboxItem
                  key={spec}
                  value={spec}
                  onClick={() => {
                    setSelectedSpecialization(spec);
                  }}
                  className="px-3 py-2 cursor-pointer text-foreground hover:bg-secondary/20 transition-colors rounded"
                >
                  {spec}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      ) : null}
    </div>
  );
}

function GovCombo({
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  /* ./public/governorate.json*/

  const [json, setJson] = useState<governorate[]>([]);

  type governorate = {
    id: string;
    governorate_name_en: string;
    governorate_name_ar: string;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/governorate.json');
        const data = await response.json();
        setJson(data);
      } catch (error) {
        console.error('Error fetching governorate data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Combobox>
      <ComboboxInput className={inputCls} placeholder="اختر المحافظة" />
      <ComboboxContent
        className={`bg-card border border-border mt-1 rounded-xl shadow-md ${cairo.className}`}
      >
        <ComboboxList>
          {json.map((gov) => (
            <ComboboxItem
              key={gov.id}
              value={gov.governorate_name_ar}
              onClick={() => onChange(gov.governorate_name_ar)}
              className="px-3 py-2 cursor-pointer text-foreground hover:bg-secondary/20 transition-colors rounded"
            >
              {gov.governorate_name_ar}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e164: string) => void;
}) {
  const countries = useMemo(() => getCountries() as CountryCode[], []);

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('EG');
  const [localNumber, setLocalNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [fullno, setFullno] = useState('');
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync outward value → local state (e.g. on reset)
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }
    const parsed = parsePhoneNumberFromString(value);
    if (parsed?.country) setSelectedCountry(parsed.country);
    if (parsed?.nationalNumber) setLocalNumber(parsed.nationalNumber);
  }, []); // run once on mount only

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search field when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase();
    return countries.filter((c) => {
      const code = getCountryCallingCode(c);
      return (
        c.toLowerCase().includes(q) ||
        `+${code}`.includes(q) ||
        code.includes(q)
      );
    });
  }, [search, countries]);

  // Build E.164 and bubble up
  const emit = (country: CountryCode, local: string) => {
    const digits = local.replace(/\D/g, '');
    const dialCode = getCountryCallingCode(country);
    const e164 = `+${dialCode}${digits}`;
    const parsed = parsePhoneNumberFromString(e164);

    onChange(e164);
    setFullno(e164);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits, format as you type
    if (e.target.value.startsWith('0'))
      e.target.value = e.target.value.slice(1);
    const raw = e.target.value.replace(/\D/g, '');
    const formatter = new AsYouType(selectedCountry);

    // Feed digit by digit to get national format
    let formatted = '';
    for (const ch of raw) formatted = formatter.input(ch);
    setLocalNumber(formatted || raw);
    emit(selectedCountry, raw);
  };

  const handleCountrySelect = (c: CountryCode) => {
    setSelectedCountry(c);
    setOpen(false);
    setSearch('');
    emit(c, localNumber.replace(/\D/g, ''));
  };

  const dialCode = `+ ${getCountryCallingCode(selectedCountry)}`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main input row */}
      <div className="flex items-center border border-border rounded-xl bg-secondary/20 overflow-visible transition-colors duration-200 focus-within:border-primary">
        {/* Country picker button */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-1.5 px-3 py-3 text-foreground border-r border-border shrink-0 hover:bg-secondary/30 transition-colors rounded-r-xl"
        >
          <span className="font-semibold text-sm tracking-wide">
            {selectedCountry}
          </span>
          <span className="text-[10px] opacity-60">{open ? '▲' : '▼'}</span>
          <span className="text-muted-foreground text-sm">{dialCode}</span>
        </button>

        {/* Local number input */}
        <input
          type="tel"
          dir="ltr"
          value={value ? localNumber : ''}
          onChange={handleLocalChange}
          maxLength={15}
          placeholder="501 234 567"
          className="flex-1 bg-transparent text-foreground outline-none px-3 py-3 placeholder:text-muted-foreground/50 placeholder:text-sm text-sm tracking-wider"
        />
      </div>
      <span
        className={`text-muted-foreground/70 text-xs tracking-wide pr-3 mt-1 block ${!localNumber ? 'hidden' : ''}`}
      >
        رقم الهاتف | {fullno}
      </span>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              ref={searchRef}
              placeholder="ابحث عن دولة أو رمز..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/20 text-foreground placeholder:text-muted-foreground/50 rounded-lg px-3 py-1.5 text-sm outline-none"
              dir="rtl"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <p className="px-3 py-3 text-muted-foreground/60 text-sm text-center">
                لا توجد نتائج
              </p>
            ) : (
              filteredCountries.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-secondary/20 transition-colors ${
                    c === selectedCountry
                      ? 'bg-secondary/20 text-primary'
                      : 'text-foreground/80'
                  }`}
                >
                  <span className="font-medium">{c}</span>
                  <span className="text-muted-foreground">
                    +{getCountryCallingCode(c)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}