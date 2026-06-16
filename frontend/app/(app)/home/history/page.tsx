import Link from "next/link";

function Page() {
  const historySections = [
    {
      title: "نتاءج الامتحانات",
      description: "شوف كل نتايج امتحاناتك",
      href: "/home/history/exams_results",
    },
    {
      title: "سجل الشراء",
      description: "شوف مشترواتاك",
      href: "/home/history/purchases",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">سجل الحساب</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {historySections.map((section) => (
          <Link key={section.href} href={section.href}>
            <div className="cursor-pointer rounded-xl border p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200">

              <h2 className="text-xl font-semibold">
                {section.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;