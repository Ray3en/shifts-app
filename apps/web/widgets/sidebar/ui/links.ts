
import type { StaticImageData } from "next/image";
import { homeIcon, scheduleIcon } from "@/shared/assets/icons";

type NavigationTypes = {
  id: number;
  path: string;
  title: string;
  icon: StaticImageData;
}

export const routesLink: NavigationTypes[] = [
  { id: 1, title: "Главная", path: "/", icon: homeIcon },
  { id: 2, title: "Смены", path: "/shifts", icon: scheduleIcon },
];
