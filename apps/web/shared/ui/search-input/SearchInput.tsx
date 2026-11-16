import Image from "next/image";
import searchIcon from "@/shared/assets/icons/search.svg";
import type { ChangeEventHandler } from "react";

type SearchInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = "Поиск" }: SearchInputProps) {
  return (
    <label className="flex h-12 w-full max-w-[398px] items-center gap-2.5 rounded-xl bg-[#f2f3f7] px-3 focus-within:ring-2 focus-within:ring-[#b9c8fa]">
      <Image src={searchIcon} width={24} height={24} alt="" aria-hidden />
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#737378]"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}
