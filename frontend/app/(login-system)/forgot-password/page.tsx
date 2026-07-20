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
import { solvePow, getTurnstileToken } from "@akedly/shield";
import { api } from "@/app/hooks/api";
import dynamic from 'next/dynamic';
import { ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

/* ---------------- Zod Schemas ---------------- */

const phoneSchema = z.object({
  phone: z.string().min(10, 'أدخل رقم هاتف صحيح'),
});

const codeSchema = z.object({
  code: z.string().length(6, 'يجب أن يكون الرمز 6 أرقام'),
});

/* ---------------- Stepper ---------------- */

const { useStepper, steps } = defineStepper(
  { id: 'enter-number', title: 'أدخل الرقم' },
  { id: 'enter-code', title: 'أدخل الرمز' },
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


function normalizeEgyptPhone(phone: string) {
  phone = phone.replace(/\s+/g, "");

  if (phone.startsWith("+20")) {
    return phone;
  }

  if (phone.startsWith("0")) {
    return `+20${phone.slice(1)}`;
  }

  if (phone.startsWith("20")) {
    return `+${phone}`;
  }

  return phone;
}

/* ---------------- Page ---------------- */

export default function Page() {
  const stepper = useStepper();
  const [phone, setPhone] = useState("");
  const [transactionReqID, setTransactionReqID] = useState("");
  const router = useRouter();

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
            'enter-number': () => <EnterNumber stepper={stepper} phone={phone} transactionReqID={transactionReqID} setPhone={setPhone} setTransactionReqID={setTransactionReqID} />,
            'enter-code': () => <EnterCode stepper={stepper} phone={phone} transactionReqID={transactionReqID} router={router} setTransactionReqID={setTransactionReqID} />,
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

function EnterNumber({ stepper, phone, transactionReqID, setPhone, setTransactionReqID }: { stepper: StepperType; phone: string; transactionReqID: string; setPhone: (phone: string) => void; setTransactionReqID: (transactionReqID: string) => void }) {
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    const result = phoneSchema.safeParse({ phone: normalizeEgyptPhone(phone) });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");

    try {
      // Check if phone is registered first
      const checkPhoneRes = await api.post("/check-phone", {
        phone: normalizeEgyptPhone(phone),
      });

      if (!checkPhoneRes.data.exists) {
        setError("رقم الهاتف هذا غير مسجل");
        return;
      }

      // 1. Get challenge
      const challengeRes = await api.get("/auth/akedly/challenge");

      const data = challengeRes.data.data;

      // 2. Solve Proof of Work
      const { nonce } = await solvePow(
        data.challenge,
        data.difficulty
      );

      // 3. Get Turnstile token if required
      let turnstileToken;

      if (data.turnstile?.required) {
        turnstileToken = await getTurnstileToken(
          data.turnstile.siteKey
        );
      }

      // 4. Send OTP
      const sendRes = await api.post("/auth/akedly/send", {
        phoneNumber: normalizeEgyptPhone(phone),
        powSolution: {
          challengeToken: data.challengeToken,
          nonce,
        },
        turnstileToken,
      });

      setTransactionReqID(
        sendRes.data.data.transactionReqID
      );

      stepper.navigation.next();
    } catch (err) {
      console.error(err);
      setError("تعذر إرسال رمز التحقق");
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

function EnterCode({ stepper, phone, transactionReqID, router, setTransactionReqID }: { stepper: StepperType; phone: string; transactionReqID: string; router: ReturnType<typeof useRouter>; setTransactionReqID: (transactionReqID: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>('');
  const timerDef = 60 * 3; // 3 mins
  const [timer, setTimer] = useState<number>(timerDef); // 3 mins
  const [isResending, setIsResending] = useState(false);
  const [resetKey, setResetKey] = useState(0); // To reset timer effect

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Timer effect - runs when resetKey changes
  useEffect(() => {
    let timerId: number | null = null;
    timerId = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerId) window.clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerId) window.clearInterval(timerId); };
  }, [resetKey]); // Depends on resetKey

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      // 1. Get challenge
      const challengeRes = await api.get("/auth/akedly/challenge");
      const data = challengeRes.data.data;

      // 2. Solve Proof of Work
      const { nonce } = await solvePow(data.challenge, data.difficulty);

      // 3. Get Turnstile token if required
      let turnstileToken;
      if (data.turnstile?.required) {
        turnstileToken = await getTurnstileToken(data.turnstile.siteKey);
      }

      // 4. Send OTP again
      const sendRes = await api.post("/auth/akedly/send", {
        phoneNumber: normalizeEgyptPhone(phone),
        powSolution: {
          challengeToken: data.challengeToken,
          nonce,
        },
        turnstileToken,
      });

      setTransactionReqID(sendRes.data.data.transactionReqID);
      setTimer(timerDef); // Reset timer value
      setResetKey(prev => prev + 1); // Trigger timer restart
    } catch (err) {
      console.error(err);
      setError("تعذر إعادة إرسال رمز التحقق");
    } finally {
      setIsResending(false);
    }
  };

  const handleNext = async () => {
    const result = codeSchema.safeParse({ code });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError('');
    try {
      await api.post("/auth/akedly/verify", {
        transactionReqID,
        otp: code,
      });

      // Get reset token
      const tokenRes = await api.post("/reset-password/token", {
        phone: normalizeEgyptPhone(phone),
      });

      router.push(
        `/reset-password?token=${encodeURIComponent(tokenRes.data.resetToken)}`
      );
    } catch {
      setError("رمز التحقق غير صحيح");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={`${labelCls} text-center`}>
          أدخل الرمز المرسل إلى هاتفك
        </label>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#e6d3a3] text-sm">
          {formatTime(timer)}
          </span>
          <button 
            onClick={handleResend}
            disabled={timer > 0 || isResending}
            className={`text-sm ${timer > 0 || isResending ? 'text-[#e6d3a3]/50 cursor-not-allowed' : 'text-[#e6d3a3] underline hover:text-[#d4c090]'}`}
          >
            {isResending ? 'جارٍ الإرسال...' : timer > 0 ? 'إعادة إرسال' : 'إعادة إرسال'}
          </button>
        </div>

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
              <InputOTPSlot index={5} />
              <InputOTPSlot index={4} />
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
