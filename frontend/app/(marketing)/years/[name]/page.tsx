const years = ['g1', 'g2', 'g3'];

export default async function Page({ params }: { params: Promise<{ name: string }>}) {
    const { name } = await params;

  const year = years.find(y => y === name);

  if (!year) {
    return <h1>year not found</h1>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="">{year === "g2" ? "تانيه ثانوي" : year === "g1" ? "اولى ثانوي" : "ثالثة ثانوي"}</h1>
    </div>
  );
}