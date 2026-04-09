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

import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from 'radix-ui';
import { request } from 'node:https';

import { API_URL } from '../config/config';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

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

  const onsubmit = async (data: Infer) => {
    console.log('valid data', data);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Request Failed: ${res.status}`);
      }

      toast.success('تم إنشاء الحساب بنجاح!');
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ اثناء انشاء الحساب');
    }
  };

  return (
    <section className="w-full min-h-screen mt-15 flex flex-row gap-10 lg:gap-20 p-5 items-center justify-center">
      <div className="left-sec w-full bg-[#1C1C18] p-6 rounded-lg shadow-sm shadow-[#e6d3a3] border-2 border-[#e6d3a3] gap-10 flex flex-col">
        <h1 className="text-4xl text-center font-bold text-[#e6d3a3]">
          إنشاء حساب
        </h1>

        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className={`flex flex-col gap-4 ${cairo.className}`}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#e6d3a3] mb-2">
              البريد الإلكتروني
            </label>
            <input
              {...form.register('email')}
              type="email"
              id="email"
              name="email"
              className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70"
              placeholder="مثال : ex@gmail.com"
            />
            {form.formState.errors.email && (
              <p>{form.formState.errors.email?.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-[#e6d3a3] mb-2">
              الاسم الكامل
            </label>
            <input
              {...form.register('name')}
              type="text"
              id="name"
              name="name"
              className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70"
              placeholder="مثال : عبدالله محمد"
            />
            {form.formState.errors.name && (
              <p>{form.formState.errors.name?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-[#e6d3a3] mb-2">رقم هاتف الطالب</label>
            <PhoneInput
              value={form.watch('studentPhone')}
              onChange={(val) => form.setValue('studentPhone', val)}
            />

            {form.formState.errors.studentPhone && (
              <p>{form.formState.errors.studentPhone?.message}</p>
            )}
          </div>

          {/* parent phone */}
          <div className="mb-4">
            <label className="block text-[#e6d3a3] mb-2">
              رقم هاتف ولي الأمر
            </label>
            <PhoneInput
              value={form.watch('parentPhone')}
              onChange={(val) => form.setValue('parentPhone', val)}
            />

            {form.formState.errors.parentPhone && (
              <p>{form.formState.errors.parentPhone?.message}</p>
            )}
          </div>

          {/* Governorate */}
          <div className="mb-4">
            <label htmlFor="governorate" className="block text-[#e6d3a3] mb-2">
              المحافظة
            </label>
            <GovCombo
              value={form.watch('governorate')}
              onChange={(val) => form.setValue('governorate', val)}
            />
            {form.formState.errors.governorate && (
              <p>{form.formState.errors.governorate?.message}</p>
            )}
          </div>
          {/* Year & specialization */}
          <div className="mb-4">
            <label htmlFor="year" className="block text-[#e6d3a3] mb-2">
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
              <p>{form.formState.errors.YearCombo?.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#e6d3a3] mb-2">
              كلمة المرور
            </label>
            <input
              {...form.register('password')}
              type="password"
              id="password"
              name="password"
              minLength={6}
              className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70"
              placeholder="كلمة المرور (6 أحرف على الأقل)"
            />
            {form.formState.errors.password && (
              <p>{form.formState.errors.password?.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-[#e6d3a3] mb-2"
            >
              تأكيد كلمة المرور
            </label>
            <input
              {...form.register('confirmPassword')}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] border-2 border-[#e6d3a3] p-2"
            />
            {form.formState.errors.confirmPassword && (
              <p>{form.formState.errors.confirmPassword?.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#e6d3a3] w-full text-[#1C1C18] font-bold py-2 px-4 rounded-lg hover:bg-[#d4c090] transition duration-200"
          >
            إنشاء الحساب
          </button>

          <span className="text-sm text-[#e6d3a3] mt-4 block">
            لديك حساب؟{' '}
            <Link href="/login" className="text-[#e6d3a3] underline">
              تسجيل الدخول
            </Link>
          </span>
        </form>
      </div>

      <div className="right-sec w-full hidden lg:block">
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpbQdjvm3StHrnFYB8615RChWXca7kgdwl0OMi"
          alt="Signup Image"
          width={800}
          height={800}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}

export default Page;

function YearCombo({
  year,
  specialize,
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

  return (
    <div className="flex gap-5 items-center justify-center">
      <Combobox>
        <ComboboxInput
          className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70"
          placeholder="اختر الصف الدراسي"
        />
        <ComboboxContent
          className={`bg-[#1C1C18] border-2 border-[#e6d3a3] mt-1 rounded-lg shadow-sm shadow-[#e6d3a3] ${cairo.className}`}
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
                className="px-3 py-2 cursor-pointer text-white hover:bg-[#2a2a25] transition-colors rounded"
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
            className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70 mt-4"
            placeholder="اختر الشعبة"
          />
          <ComboboxContent
            className={`bg-[#1C1C18] border-2 border-[#e6d3a3] mt-1 rounded-lg shadow-sm shadow-[#e6d3a3] ${cairo.className}`}
          >
            <ComboboxList>
              {specializations.map((spec) => (
                <ComboboxItem
                  key={spec}
                  value={selectedSpecialization}
                  onClick={() => {
                    setSelectedSpecialization(spec);
                    onSpecializationChange(selectedSpecialization.toString());
                  }}
                  className="px-3 py-2 cursor-pointer text-white hover:bg-[#2a2a25] transition-colors rounded"
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
  value,
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
      <ComboboxInput
        className="rounded-lg bg-[#1C1C18] w-full outline-none text-[#e6d3a3] placeholder:text-[#e6d3a3] border-2 border-[#e6d3a3] p-2 placeholder:opacity-70"
        placeholder="اختر المحافظة"
      />
      <ComboboxContent
        className={`bg-[#1C1C18] border-2 border-[#e6d3a3] mt-1 rounded-lg shadow-sm shadow-[#e6d3a3] ${cairo.className}`}
      >
        <ComboboxList>
          {json.map((gov) => (
            <ComboboxItem
              key={gov.id}
              value={gov.governorate_name_ar}
              onClick={() => onChange(gov.governorate_name_ar)}
              className="px-3 py-2 cursor-pointer text-white hover:bg-[#2a2a25] transition-colors rounded"
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
      <div
        className={`flex items-center border-2 border-[#e6d3a3]  rounded-lg bg-[#1C1C18] overflow-visible transition-colors duration-200`}
      >
        {/* Country picker button */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-1.5 px-3 py-2.5 text-[#e6d3a3] border-r border-[#e6d3a3]/30 shrink-0 hover:bg-[#2a2a25] transition-colors"
        >
          <span className="font-semibold text-sm tracking-wide">
            {selectedCountry}
          </span>
          <span className="text-[10px] opacity-60">{open ? '▲' : '▼'}</span>
          <span className="text-[#e6d3a3]/50 text-sm">{dialCode}</span>
        </button>

        {/* Local number input */}
        <input
          type="tel"
          dir="ltr"
          value={value ? localNumber : ''}
          onChange={handleLocalChange}
          maxLength={15}
          placeholder="501 234 567"
          className="flex-1 bg-transparent text-[#e6d3a3] outline-none px-3 py-2.5 placeholder:text-[#e6d3a3]/30 text-sm tracking-wider"
        />
      </div>
      <span
        className={`text-[#e6d3a3]/30 text-sm tracking-wide pr-3 ${!localNumber ? 'hidden' : ''}`}
      >
        رقم الهاتف | {fullno}
      </span>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-[#1C1C18] border border-[#e6d3a3]/60 rounded-lg shadow-xl shadow-black/40 overflow-hidden">
          <div className="p-2 border-b border-[#e6d3a3]/20">
            <input
              ref={searchRef}
              placeholder="ابحث عن دولة أو رمز..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#2a2a25] text-[#e6d3a3] placeholder:text-[#e6d3a3]/40 rounded px-3 py-1.5 text-sm outline-none"
              dir="rtl"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <p className="px-3 py-3 text-[#e6d3a3]/40 text-sm text-center">
                لا توجد نتائج
              </p>
            ) : (
              filteredCountries.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-[#2a2a25] transition-colors ${
                    c === selectedCountry
                      ? 'bg-[#2a2a25] text-[#e6d3a3]'
                      : 'text-[#e6d3a3]/80'
                  }`}
                >
                  <span className="font-medium">{c}</span>
                  <span className="text-[#e6d3a3]/50">
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
