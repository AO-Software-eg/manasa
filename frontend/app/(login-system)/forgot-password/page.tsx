'use client';

import { defineStepper } from '@stepperize/react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Cairo } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import dynamic from 'next/dynamic';
import { ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

/* ---------------- Zod Schemas ---------------- */

const phoneSchema = z.object({
  phone: z.string().min(10, 'أدخل رقم هاتف صحيح'),
});

const codeSchema = z.object({
  code: z.string().length(4, 'يجب أن يكون الرمز 4 أرقام'),
});

/* ---------------- Stepper ---------------- */

const { useStepper, steps } = defineStepper(
  { id: 'enter-number', title: 'أدخل الرقم' },
  { id: 'enter-code', title: 'أدخل الرمز' },
  { id: 'done', title: 'تم' },
);

type StepperType = ReturnType<typeof useStepper>;

/* ---------------- Shared style tokens (matching login page) ---------------- */
const inputCls =
  'bg-secondary/20 rounded-xl w-full outline-none text-foreground placeholder:text-muted-foreground/60 border border-border focus:border-primary p-3 transition-colors placeholder:text-sm';
const labelCls = 'block text-sm font-semibold text-foreground/80 mb-2';
const errorCls = 'text-red-400 text-sm mt-1';
const btnPrimaryCls =
  'bg-primary w-full text-primary-foreground rounded-xl font-bold py-3 px-4 hover:bg-primary/95 transition duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';
const btnSecondCls =
  'border border-border text-foreground font-semibold py-3 px-4 rounded-xl hover:bg-secondary/20 transition duration-200 cursor-pointer';

/* ---------------- Page ---------------- */

export default function Page() {
  const stepper = useStepper();

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div dir="rtl" className={`w-full max-w-md space-y-6 ${cairo.className}`}>
        {/* Step Indicator */}
        <div className="flex items-center">
          {steps.map((step, index) => {
            const currentId = stepper.state.current.data.id;
            const isActive = step.id === currentId;
            const currentIdx = steps.findIndex((s) => s.id === currentId);
            const isCompleted = index < currentIdx;

            return (
              <div key={step.id} className="flex-1 flex items-center gap-2">
                {/* Circle */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-300
                      ${isActive ? 'bg-primary border-primary scale-110' : ''}
                      ${isCompleted ? 'bg-primary border-primary' : ''}
                      ${!isActive && !isCompleted ? 'bg-transparent border-border' : ''}
                    `}
                  />
                  <span
                    className={`text-xs transition-opacity duration-300
                      ${isActive ? 'text-primary font-bold' : 'text-muted-foreground/60'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mb-4 transition-colors duration-300
                      ${isCompleted ? 'bg-primary' : 'bg-border'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card — mirrors login page card */}
        <div className="bg-card p-8 rounded-2xl border border-border shadow-md flex flex-col gap-6 transition-all duration-300">
          <div className="text-center space-y-1.5">
            <h2 className="text-3xl font-bold text-primary">
              {stepper.state.current.data.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {stepper.state.current.data.id === 'enter-number' &&
                'سنرسل رمز تحقق إلى هاتفك لإعادة تعيين كلمة المرور'}
              {stepper.state.current.data.id === 'enter-code' &&
                'أدخل الرمز المكون من 4 أرقام الذي وصلك'}
              {stepper.state.current.data.id === 'done' &&
                'يمكنك الآن العودة لتسجيل الدخول'}
            </p>
          </div>

          {stepper.flow.switch({
            'enter-number': () => <EnterNumber stepper={stepper} />,
            'enter-code': () => <EnterCode stepper={stepper} />,
            done: () => <Done stepper={stepper} />,
          })}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          تذكرت كلمة المرور؟{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ---------------- Steps ---------------- */

function EnterNumber({ stepper }: { stepper: StepperType }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      // TODO: call the "send OTP" endpoint here with `phone`
      await new Promise((resolve) => setTimeout(resolve, 400));
      stepper.navigation.next();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="phone" className={labelCls}>
          رقم الهاتف
        </label>
        <div className="relative">
          <PhoneCall
            size={16}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            id="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            placeholder="مثال : 01012345678"
            type="tel"
            dir="ltr"
            className={`${inputCls} pr-9 text-left`}
          />
        </div>
        {error && <p className={errorCls}>{error}</p>}
      </div>

      <button
        onClick={handleNext}
        disabled={isSubmitting}
        className={btnPrimaryCls}
      >
        {isSubmitting ? 'جارِ الإرسال...' : 'إرسال الرمز'}
      </button>
    </div>
  );
}

function EnterCode({ stepper }: { stepper: StepperType }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleNext = async () => {
    const result = codeSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      // TODO: call the "verify OTP" endpoint here with `code`
      await new Promise((resolve) => setTimeout(resolve, 400));
      stepper.navigation.next();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // TODO: call the "resend OTP" endpoint here
    setSecondsLeft(60);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={`${labelCls} text-center`}>
          أدخل الرمز المرسل إلى هاتفك
        </label>

        <div className="flex justify-center [&_[data-slot]]:bg-secondary/20 [&_[data-slot]]:border-border [&_[data-slot]]:text-foreground [&_[data-slot]]:rounded-lg [&_[data-slot]]:text-lg [&_[data-slot]]:font-bold [&_[data-slot][data-active]]:ring-2 [&_[data-slot][data-active]]:ring-primary [&_[data-slot][data-active]]:border-primary">
          <InputOTP
            maxLength={4}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError('');
            }}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={0} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && <p className={`${errorCls} text-center`}>{error}</p>}

        <div className="text-center mt-3">
          {secondsLeft > 0 ? (
            <span className="text-xs text-muted-foreground">
              يمكنك إعادة الإرسال خلال {secondsLeft} ثانية
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-xs text-primary hover:underline font-semibold"
            >
              إعادة إرسال الرمز
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={isSubmitting || code.length < 4}
        className={btnPrimaryCls}
      >
        {isSubmitting ? 'جارِ التحقق...' : 'تحقق'}
      </button>

      <button
        onClick={() => stepper.navigation.prev()}
        className={`${btnSecondCls} w-full flex items-center justify-center gap-2`}
      >
        <ArrowRight size={16} />
        رجوع
      </button>
    </div>
  );
}

function Done({ stepper }: { stepper: StepperType }) {
  const router = useRouter();
  const [lottieFailed, setLottieFailed] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center text-center py-2">
      <div className="flex items-center justify-center w-32 h-32">
        {!lottieFailed ? (
          <LottieSafe onError={() => setLottieFailed(true)} />
        ) : (
          <CheckCircle2 size={96} className="text-primary" strokeWidth={1.5} />
        )}
      </div>

      <p className="text-foreground text-lg font-bold">تم التحقق بنجاح!</p>
      <p className="text-sm text-muted-foreground -mt-2">
        يمكنك الآن تعيين كلمة مرور جديدة
      </p>

      <button
        onClick={() => router.push('/login')}
        className={`${btnPrimaryCls} w-full`}
      >
        العودة لتسجيل الدخول
      </button>
    </div>
  );
}

function LottieSafe({ onError }: { onError: () => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    try {
      const anim = require('../../public/successAnim.json');
      setData(anim);
    } catch {
      onError();
    }
  }, []);

  if (!data) return null;

  return <Lottie animationData={data} loop={false} autoplay onLoopComplete={undefined} />;
}