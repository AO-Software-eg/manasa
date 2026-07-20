'use client';

import { defineStepper } from '@stepperize/react';
import { useState } from 'react';
import { z } from 'zod';
import { Cairo } from 'next/font/google';
import { useRouter } from 'next/navigation';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { solvePow, getTurnstileToken } from "@akedly/shield";
import { api } from "@/app/hooks/api";
import dynamic from 'next/dynamic';

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

/* ---------------- Shared style tokens (matching signup page) ---------------- */
const GOLD = '#e6d3a3';
const BG = '#1C1C18';

const inputCls = `rounded-lg bg-[${BG}] w-full outline-none text-[${GOLD}] placeholder:text-[${GOLD}] border-2 border-[${GOLD}] p-2 placeholder:opacity-70`;

const btnPrimaryCls = `bg-[${GOLD}] text-[${BG}] font-bold py-2 px-5 rounded-lg hover:bg-[#d4c090] transition duration-200`;

const btnSecondCls = `border-2 border-[${GOLD}] text-[${GOLD}] font-bold py-2 px-5 rounded-lg hover:bg-[#2a2a25] transition duration-200`;


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
    <div
      dir="rtl"
      className={`min-h-screen mt-15 flex items-center justify-center bg-[${BG}] text-[${GOLD}] p-6 ${cairo.className}`}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center">
          {steps.map((step, index) => {
            const currentId = stepper.state.current.data.id;
            const isActive = step.id === currentId;
            const currentIdx = steps.findIndex((s) => s.id === currentId);
            const isCompleted = index < currentIdx;

            return (
              <div key={step.id} className="flex-1 flex items-center gap-2 ">
                {/* Circle */}
                <div className="flex flex-col items-center gap-1 ">
                  <div
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-300
                      ${isActive ? `bg-[${GOLD}] border-[${GOLD}] scale-110` : ''}
                      ${isCompleted ? `bg-[${GOLD}] border-[${GOLD}]` : ''}
                      ${!isActive && !isCompleted ? `bg-transparent border-[${GOLD}]/40` : ''}
                    `}
                  />
                  <span
                    className={`text-xs transition-opacity duration-300
                      ${isActive ? `text-[${GOLD}] font-bold` : `text-[${GOLD}]/40`}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mb-4 transition-colors duration-300  
                      ${isCompleted ? `bg-[${GOLD}]` : `bg-[${GOLD}]/20`}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card — mirrors signup page card */}
        <div
          className={`bg-[${BG}] p-6 rounded-lg shadow-sm shadow-[${GOLD}] border-2 border-[${GOLD}] flex flex-col gap-6`}
        >
          <h2 className="text-2xl text-center font-bold text-[${GOLD}]">
            {stepper.state.current.data.title}
          </h2>

          {stepper.flow.switch({
            'enter-number': () => <EnterNumber stepper={stepper} phone={phone} transactionReqID={transactionReqID} setPhone={setPhone} setTransactionReqID={setTransactionReqID} />,
            'enter-code': () => <EnterCode stepper={stepper} phone={phone} transactionReqID={transactionReqID} router={router} />,
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Steps ---------------- */

function EnterNumber({ stepper, phone, transactionReqID, setPhone, setTransactionReqID }: { stepper: StepperType; phone: string; transactionReqID: string; setPhone: (phone: string) => void; setTransactionReqID: (transactionReqID: string) => void }) {
  const [error, setError] = useState<string>('');

  const handleNext = async () => {
    const result = phoneSchema.safeParse({ phone: normalizeEgyptPhone(phone) });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");

    try {
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
        <label className={`block text-[${GOLD}] mb-2`}>رقم الهاتف</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="مثال : 01012345678"
          type="tel"
          className={inputCls}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>

      <button onClick={handleNext} className={`${btnPrimaryCls} w-full`}>
        التالي
      </button>
    </div>
  );
}

function EnterCode({ stepper, phone, transactionReqID, router }: { stepper: StepperType; phone: string; transactionReqID: string; router: ReturnType<typeof useRouter> }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>('');

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

      // Navigate to reset password page with token
      router.push(`/reset-password?token=${encodeURIComponent(tokenRes.data.resetToken)}`);
    } catch {
      setError("رمز التحقق غير صحيح");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={`block text-[${GOLD}] mb-3`}>
          أدخل الرمز المرسل إلى هاتفك
        </label>

        <div className="flex justify-center [&_[data-slot]]:bg-[#1C1C18]  [&_[data-slot]]:text-[#e6d3a3] [&_[data-slot]]:rounded-lg [&_[data-slot]]:text-lg [&_[data-slot]]:font-bold [&_[data-slot][data-active]]:ring-2 [&_[data-slot][data-active]]:ring-[#e6d3a3]">
          <InputOTP
            maxLength={6}
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

        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}
      </div>

      <button onClick={handleNext} className={`${btnPrimaryCls} w-full`}>
        تحقق
      </button>

      <button
        onClick={() => stepper.navigation.prev()}
        className={`${btnSecondCls} w-full`}
      >
        رجوع
      </button>
    </div>
  );
}
