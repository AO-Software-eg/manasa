

type Props = {
  year: 'اولى ثانوي' | 'تانية ثانوي' | 'ثالثة ثانوي',
}

function YearBox({ year }: Props) {
  return (
    <div className='w-80 hover:scale-103 transition hover:shadow-xl hover:shadow-[#e6d3a3]  overflow-hidden  h-40 bg-[#adad98] text-[#e6d3a3] rounded-lg flex items-center text-center text-4xl font-bold'>
      <h1 className=" mx-auto">
        {year}
      </h1>
    

    </div>
  )
}

export default YearBox
