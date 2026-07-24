'use client';
import { useMe } from '@/app/hooks/queries/useMe';
import { api } from '@/app/hooks/api';
import UploadImage from '@/app/components/UploadImage';
import CardLayout from '@/app/components/CardLayout';
import { useState } from 'react';
import {
  Camera,
  LogOut,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Hash,
  Edit,
} from 'lucide-react';
import RecentActivityCard from '@/app/components/RecentActivityCard';

function page() {
  const [showUpload, setShowUpload] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleUpload = (url: string) => {
    setAvatarUrl(url);
    setShowUpload(false);
  };

  const { data: userData, isLoading } = useMe();

  if (isLoading) return null;

  const initials = userData?.name
    ? userData.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
    : 'U';

  const infoFields = [
    { icon: <Hash size={15} />, label: 'معرف المستخدم', value: userData?.id },
    {
      icon: <Mail size={15} />,
      label: 'البريد الإلكتروني',
      value: userData?.email,
    },
    {
      icon: <Phone size={15} />,
      label: 'رقم الهاتف',
      value: userData?.studentPhone,
    },
    {
      icon: <BookOpen size={15} />,
      label: 'سنة التسجيل',
      value: userData?.year,
    },
    ...(userData?.specialization
      ? [
          {
            icon: <BookOpen size={15} />,
            label: 'التخصص',
            value: userData.specialization,
          },
        ]
      : []),
    {
      icon: <MapPin size={15} />,
      label: 'المحافظة',
      value: userData?.governorate,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full my-10 p-4" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CardLayout classname="flex flex-col items-center gap-5 py-8">
          <button
            onClick={() => setShowUpload(true)}
            className="relative group w-28 h-28 rounded-full overflow-hidden border-2 border-primary/30 bg-secondary/70 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="تغيير صورة الملف الشخصي"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary text-3xl font-bold select-none">
                {initials}
              </span>
            )}
            <span className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Camera size={20} className="text-primary" />
              <span className="text-primary text-[10px] font-medium">
                تغيير
              </span>
            </span>
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3 group">
              {userData?.name || '—'}{' '}
              <span>
                <Edit
                  width={20}
                  className="opacity-40 transition-all duration-300 group-hover:opacity-100"
                />
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {userData?.email || '—'}
            </p>
          </div>

          <div className="w-full border-t border-border" />

          <button
            onClick={() => {
              api.post('/auth/logout', {}).then(() => {
                window.location.href = '/';
              });
            }}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={15} />
            تسجيل الخروج
          </button>
        </CardLayout>

        <CardLayout classname="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            بيانات الحساب
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoFields.map((field, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 bg-card border border-border rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-1.5 text-primary/70">
                  {field.icon}
                  <span className="text-[10px] uppercase tracking-widest font-semibold">
                    {field.label}
                  </span>
                </div>
                <span className="text-sm text-foreground font-medium pr-0.5">
                  {field.value ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </CardLayout>
      </div>

      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpload(false);
          }}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-4 left-4 text-muted-foreground hover:text-primary transition-colors text-xl leading-none cursor-pointer"
              aria-label="إغلاق"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-1 mb-5">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <Camera size={18} className="text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                تغيير الصورة الشخصية
              </h2>
              <p className="text-xs text-muted-foreground">
                اختر صورة من جهازك لتحديث ملفك الشخصي
              </p>
            </div>

            <UploadImage onUpload={handleUpload} />
          </div>
        </div>
      )}

      <RecentActivityCard title="" />
    </div>
  );
}

export default page;
