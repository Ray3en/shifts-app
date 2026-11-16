import { Sidebar } from "@/widgets/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 p-7 max-md:p-4">
        <div className="flex h-11 items-center text-sm text-[#4b4d55]">Рабочее пространство</div>
        <h1 className="my-5 text-3xl font-medium tracking-tight">Главная</h1>
        <section className="min-h-90 rounded-2xl bg-white p-7">
          <div className="h-4.5 w-[min(420px,70%)] rounded-md bg-[#eceef3]" />
          <div className="mt-3.5 h-4.5 w-[min(270px,45%)] rounded-md bg-[#eceef3]" />
        </section>
      </main>
    </div>
  );
}
