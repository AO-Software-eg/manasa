import YearBox from "../components/YearBox"

function YearSec() {
    return (
        <section className="flex flex-col gap-5 py-20">
            <h1 className="text-6xl font-bold text-center mt-10 mb-5 text-[#E5E5E5]">
                السنوات الدراسية
            </h1>
            <div className="flex gap-10 justify-around items-center mx-auto p-5 ">
                <YearBox year="اولى ثانوي" />
                <YearBox year="تانية ثانوي" />
                <YearBox year="ثالثة ثانوي" />
            </div>
        </section>
    )
}


export default YearSec
