import CardLayout from "@/app/components/CardLayout"
import { CreditCard, Banknote, Smartphone, ArrowRight, ChevronLeft, Share2, Globe, MessageCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"

const balanceData = [
  {
    id: "current",
    title: "الرصيد الحالي",
    value: "٢٥٠ ج.م",
    icon: Banknote,
    classname: "col-span-1 lg:col-span-2",
  },
  {
    id: "pending",
    title: "معلق",
    value: "٠ ج.م",
    icon: CreditCard,
    classname: "col-span-1",
  },
]

const topUpMethods = [
  {
    id: "vodafone-cash",
    title: "فودافون كاش",
    icon: Smartphone,
    description: "رقم المحمول الخاص بك",
  },
  {
    id: "bank",
    title: "تحويل بنكي",
    icon: Banknote,
    description: "رقم الحساب البنكي",
  },
  {
    id: "card",
    title: "بطاقة ائتمان",
    icon: CreditCard,
    description: "رقم البطاقة",
  },
]

function WalletPage() {
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
                <p className="text-[#e6d3a3]/70 text-lg">إدارة رصيدك وشحن الحساب</p>
              </div>
              <Link href="/user/history" className="flex items-center gap-2 text-[#e6d3a3]/70 hover:text-[#e6d3a3] transition">
                <ChevronLeft size={20} />
                سجل العمليات
              </Link>
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
                  <h2 className="text-3xl font-bold text-[#e6d3a3]">{card.value}</h2>
                </div>
              </div>
            </CardLayout>
          ))}

          {/* Top-up Methods */}
          <CardLayout classname="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#e6d3a3]">شحن الرصيد</h2>
              <div className="text-sm text-[#e6d3a3]/70">الحد الأدنى ٥٠ ج.م</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topUpMethods.map((method) => (
                <Link
                  key={method.id}
                  href="#"
                  className="group flex flex-col items-center p-6 border-2 border-[#3b3b34]/50 hover:border-[#e6d3a3]/30 rounded-2xl bg-[#1a1a1a] hover:bg-[#222] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-center"
                >
                  <div className="p-4 bg-[#3b3b34]/50 rounded-2xl mb-4 group-hover:bg-[#e6d3a3]/10 transition">
                    <method.icon size={32} className="text-[#e6d3a3] group-hover:scale-110 transition" />
                  </div>
                  <h3 className="font-semibold text-[#e6d3a3] mb-1">{method.title}</h3>
                  <p className="text-xs text-[#e6d3a3]/60">{method.description}</p>
                  <ArrowRight size={20} className="mt-auto text-[#e6d3a3]/70 group-hover:translate-x-1 transition self-end" />
                </Link>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mt-10 p-6 bg-gradient-to-r from-[#3b3b34]/50 to-[#2a2a25]/50 rounded-2xl border border-[#3b3b34]/50">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[#e6d3a3]">المجموع</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="bg-transparent border border-[#3b3b34]/50 rounded-xl px-4 py-3 text-2xl font-bold text-right text-[#e6d3a3] w-32 focus:border-[#e6d3a3]/50 focus:outline-none"
                      min="50"
                    />
                    <span className="text-[#e6d3a3]/70 text-lg">ج.م</span>
                  </div>
                </div>
                <button className="px-12 py-4 bg-gradient-to-r from-[#e6d3a3] to-[#d4c184] text-[#1C1C18] font-semibold rounded-xl hover:from-[#d4c184] hover:to-[#b8a078] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap ml-auto">
                  شحن الآن
                </button>
              </div>
            </div>
          </CardLayout>

          {/* Recent Transactions */}
          <CardLayout classname="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#e6d3a3]">آخر العمليات</h3>
              <Link href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] flex items-center gap-1 text-sm transition">
                عرض الكل <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { type: "شحن", amount: "+١٠٠ ج.م", date: "منذ ٢ ساعة", status: "نجح" },
                { type: "سحب", amount: "-٥٠ ج.م", date: "منذ ٣ أيام", status: "نجح" },
                { type: "شراء", amount: "-٢٠ ج.م", date: "منذ ٥ أيام", status: "نجح" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a]/50 hover:bg-[#222] rounded-xl transition cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#3b3b34]/50 rounded-xl flex items-center justify-center group-hover:bg-[#e6d3a3]/20 transition">
                      <Banknote size={20} className="text-[#e6d3a3]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#e6d3a3]">{transaction.type}</p>
                      <p className="text-sm text-[#e6d3a3]/60">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-[#e6d3a3]">{transaction.amount}</p>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardLayout>
        </div>
      </div>
    </div>
  )
}

export default WalletPage

