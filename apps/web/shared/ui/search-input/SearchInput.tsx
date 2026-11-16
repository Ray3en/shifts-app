import Image from "next/image";
import clearSearchIcon from "@/shared/assets/icons/clear-search.svg";
import searchIcon from "@/shared/assets/icons/search.svg";
import type { ChangeEventHandler } from "react";

type SearchInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  placeholder?: string;
  variant?: "gray" | "white";
};

export function SearchInput({ value, onChange, onClear, placeholder = "Поиск", variant = "gray" }: SearchInputProps) {
  return (
    <label className={`flex h-12 w-full max-w-[398px] items-center gap-2.5 rounded-xl border px-3 transition-colors ${variant === "gray" ? "border-transparent bg-[#f1f2f5]" : "border-transparent bg-white"} hover:border-[#c7c8cd] focus-within:border-[#c7c8cd]`}>
      <Image src={searchIcon} width={24} height={24} alt="" aria-hidden />
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-base text-[#242426] outline-none placeholder:text-[#737378] [&::-webkit-search-cancel-button]:appearance-none"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value ? <button type="button" className="grid size-6 shrink-0 place-items-center rounded-md" aria-label="Очистить поиск" onClick={onClear}>
        <Image src={clearSearchIcon} width={20} height={20} alt="" aria-hidden />
      </button> : null}
    </label>
  );
}
