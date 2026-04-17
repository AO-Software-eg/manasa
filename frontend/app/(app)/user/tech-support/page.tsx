import { MessageCircle } from "lucide-react"

function page() {
  return (
    <div className='flex flex-col container items-center justify-center '>
      <h1 className='text-2xl font-bold text-center mb-8 text-[#e6d3a3] leading-tight'>
     لو عندك اي مشكلة او استفسار بخصوص الكورسات او الموقع بشكل عام، تقدر تتواصل معانا من خلال الواتس اب او من خلال الايميل او من خلال الفورم الأتي
      </h1>

      <form className='flex flex-col gap-4 mt-8 w-full md:w-1/2'>
        <input type="text" placeholder='اسمك' className='w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <input type="email" placeholder='ايميلك' className='w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <textarea placeholder='رسالتك' className='w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32' />
        <button type='submit' className='w-full bg-[#525248] text-white p-4 rounded-lg hover:bg-[#43433c] transition-colors duration-300'>ارسال</button>
      </form>
      <div className='flex mt-10 gap-5 items-center justify-center '>
        <button className=' bg-green-600 text-white p-4 rounded-lg hover:bg-[#43433c] transition-colors duration-300 flex items-center gap-4'><MessageCircle /> تواصل معنا عبر الواتس اب</button>
        <button className=' bg-[#525248] text-white p-4 rounded-lg hover:bg-[#43433c] transition-colors duration-300'>تواصل معنا عبر الايميل</button>
      </div>

    </div>
  )
}

export default page
