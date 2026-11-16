import { Sidebar } from "@/widgets/sidebar";

export default function ShiftsLayout({ children }: LayoutProps<"/shifts">) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
