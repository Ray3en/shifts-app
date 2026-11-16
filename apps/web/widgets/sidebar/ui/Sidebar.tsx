"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ringIcon } from "@/shared/assets/icons";
import { routesLink } from "./links";

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hideLabel = isCollapsed ?
        "w-0 overflow-hidden opacity-0 pointer-events-none" :
        "opacity-100 max-md:w-0 max-md:overflow-hidden max-md:opacity-0";

    return (
        <aside className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-[#e2e4ea] bg-[#f5f6f9] py-5 transition-[width] duration-200 ${isCollapsed ? "w-18 px-0" : "w-60 px-3 max-md:w-18 max-md:px-0"}`}>
            <div className={`flex h-10 items-center px-2 ${isCollapsed ? "justify-center" : "justify-between max-md:justify-center"}`}>
                <Link className="flex min-w-0 items-center text-lg font-semibold text-[#15161a] no-underline" href="/" aria-label="CRM — главная">
                    {/* <span className={isCollapsed ? "block w-6 text-center" : "hidden max-md:block max-md:w-6 max-md:text-center"}>CRM</span> */}
                    <span className={''}>CRM</span>
                </Link>
                <button className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-transparent hover:bg-[#e9ebf1] ${hideLabel}`} type="button" aria-label="Уведомления">
                    <Image src={ringIcon} alt="" width={24} height={24} />
                </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1" aria-label="Основная навигация">
                {routesLink.map((route) => {
                    const isActive = pathname === route.path;
                    return (
            <Link className={`flex h-10 items-center overflow-hidden whitespace-nowrap rounded-lg px-2.5 text-[#292a2e] no-underline hover:bg-[#eceef3] ${isActive ? "bg-white font-medium" : ""} ${isCollapsed ? "justify-center gap-0 px-0" : "gap-3 max-md:justify-center max-md:gap-0 max-md:px-0"}`} key={route.id} href={route.path} title={isCollapsed ? route.title : undefined} aria-current={isActive ? "page" : undefined}>
                            <span className="grid size-6 shrink-0 place-items-center"><Image src={route.icon} alt="" width={24} height={24} /></span>
                            <span className={hideLabel}>{route.title}</span>
                        </Link>
                    );
                })}
            </nav>

      <button className={`mt-auto flex h-10 w-full cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-lg border-0 bg-transparent px-2.5 hover:bg-[#e9ebf1] ${isCollapsed ? "justify-center gap-0 px-0" : "gap-3 max-md:justify-center max-md:gap-0 max-md:px-0"}`} type="button" onClick={() => setIsCollapsed((value) => !value)} aria-expanded={!isCollapsed} aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}>
                <span className="grid size-5 shrink-0 place-items-center rounded-sm border-[1.5px] border-current"><span className="h-full w-px -translate-x-0.75 bg-current" /></span>
                <span className={hideLabel}>{isCollapsed ? "Развернуть меню" : "Свернуть меню"}</span>
            </button>
        </aside>
    );
}
