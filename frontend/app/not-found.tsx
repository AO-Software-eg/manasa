

function notFound() {
  return (
    <div className="text-center py-20 min-h-screen flex flex-col gap-5 justify-center items-center">
      <h1 className="text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]">
        404 - الصفحة غير موجودة
      </h1>
      <p className="text-xl text-center text-[#E5E5E5]">
        عذراً، الصفحة التي تبحث عنها غير موجودة. الرجاء التحقق من الرابط
        والمحاولة مرة أخرى.
      </p>
    </div>
  );
}

export default notFound;
