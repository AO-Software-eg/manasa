'use client';
import CardLayout from '@/app/components/CardLayout';
import { CreditCard, Banknote, ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useWallet, useGetWallet } from '@/app/hooks/queries/usePayment';
import { useMe } from '@/app/hooks/queries/useMe';
import { useState } from 'react';

function WalletPage() {
  const [amount, setAmount] = useState(0);
  const { data: userData } = useMe();
  const walletMutation = useWallet();
  const { data: walletData } = useGetWallet();
  const balance = walletData?.balance || 0;

  const balanceData = [
    {
      id: 'current',
      title: 'الرصيد الحالي',
      value: balance,
      icon: Banknote,
      classname: 'col-span-1 lg:col-span-2',
    },
    {
      id: 'pending',
      title: 'معلق',
      value: 0,
      icon: CreditCard,
      classname: 'col-span-1',
    },
  ];

  const handleWalletDeposit = () => {
    if (amount < 50) {
      alert('الحد الأدنى للشحن هو ٥٠ ج.م');
      return;
    }

    walletMutation.mutate(
      { amount, phoneNumber: userData?.studentPhone, type: 'wallet-deposit' },
      {
        onSuccess: (data) => {
          const paymentKey = data.payment_keys[0].key;
          const url = `https://accept.paymob.com/api/acceptance/iframes/1056311?payment_token=${paymentKey}`;
          window.location.href = url;
          setAmount(0);
        },
      },
    );
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Header */}
          <CardLayout classname="col-span-1 lg:col-span-3  backdrop-blur-sm border-[#3b3b34]/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#e6d3a3] via-[#d4c184] to-[#b8a078] bg-clip-text text-transparent drop-shadow-lg mb-2">
                  المحفظة
                </h1>
                <p className="text-[#e6d3a3]/70 text-lg">
                  إدارة رصيدك وشحن الحساب
                </p>
              </div>
            </div>
          </CardLayout>

          {/* Balance Cards */}
          {balanceData.map((card) => (
            <CardLayout key={card.id} classname={card.classname}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#3b3b34]/50 rounded-2xl">
                  <card.icon size={24} className="text-[#e6d3a3]" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-[#e6d3a3]/70 text-sm">{card.title}</p>
                  <h2 className="text-3xl font-bold text-[#e6d3a3]">
                    {card.value}
                  </h2>
                </div>
              </div>
            </CardLayout>
          ))}

          {/* Top-up Methods */}
          <CardLayout classname="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#e6d3a3]">شحن الرصيد</h2>
              <div className="text-sm text-[#e6d3a3]/70">
                الحد الأدنى ٥٠ ج.م
              </div>
            </div>

            {/* Amount Input */}
            <div className="mt-10 p-6 bg-gradient-to-r from-[#3b3b34]/50 to-[#2a2a25]/50 rounded-2xl border border-[#3b3b34]/50">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[#e6d3a3]">
                    المجموع
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="bg-transparent border border-[#3b3b34]/50 rounded-xl px-4 py-3 text-2xl font-bold text-right text-[#e6d3a3] w-32 focus:border-[#e6d3a3]/50 focus:outline-none"
                      min="50"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <span className="text-[#e6d3a3]/70 text-lg">ج.م</span>
                  </div>
                </div>
                <button
                  onClick={handleWalletDeposit}
                  disabled={amount < 50}
                  className="px-12 py-4 bg-gradient-to-r disabled:opacity-50 disabled:pointer-events-none from-[#e6d3a3] to-[#d4c184] text-[#1C1C18] font-semibold rounded-xl hover:from-[#d4c184] hover:to-[#b8a078] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap ml-auto"
                >
                  شحن الآن
                </button>
                <div className="flex gap-4 mt-4 lg:mt-0">
                  {[100, 200, 500, 1000].map((value) => (
                    <button key={value} onClick={() => setAmount(value)} className='border border-[#3b3b34]/50 rounded-xl px-4 py-2 text-[#e6d3a3] hover:bg-[#3b3b34]/50 transition-all'>
                      {value} ج.م
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
