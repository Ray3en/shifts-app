
import type { ButtonProps, ButtonTone, ButtonVariant } from "./Button.types";

const styles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  neutral: {
    primary: "border-transparent bg-[#242426] text-white hover:bg-[#3f3f47] active:bg-[#5c5c66]",
    secondary: "border-transparent bg-[#f1f2f5] text-[#17171a] hover:bg-[#e5e6eb] active:bg-[#cacbd2]",
    tertiary: "border-[#3f4046] bg-transparent text-[#17171a] hover:bg-[#f1f2f5] active:bg-[#e3e4e9]",
    quaternary: "border-[#e1e3e8] bg-transparent text-[#17171a] hover:bg-[#f4f5f7] active:bg-[#e7e8ed]",
    quinary: "border-transparent bg-white text-[#17171a] hover:bg-[#f3f4f7] active:bg-[#e6e7ec]",
  },
  brand: {
    primary: "border-transparent bg-[#5d7bea] text-white hover:bg-[#2954e8] active:bg-[#2145c4]",
    secondary: "border-transparent bg-[#e7ecfc] text-[#2453e9] hover:bg-[#d2dcfb] active:bg-[#b3c4f6]",
    tertiary: "border-[#6f8cf2] bg-transparent text-[#2453e9] hover:bg-[#f0f3ff] active:bg-[#dbe3ff]",
    quaternary: "border-[#b8c5f7] bg-transparent text-[#2453e9] hover:bg-[#f0f3ff] active:bg-[#dbe3ff]",
    quinary: "border-transparent bg-white text-[#2453e9] hover:bg-[#f0f3ff] active:bg-[#dbe3ff]",
  },
};

export function Button({
  children,
  className = "",
  variant = "primary",
  tone = "neutral",
  iconStart,
  iconEnd,
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#91a6f5] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-transparent disabled:bg-[#f1f2f5] disabled:text-[#bfc1c8] ${styles[tone][variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      type={type}
      {...props}
    >
      {iconStart ? <span className="grid size-4 shrink-0 place-items-center" aria-hidden="true">{iconStart}</span> : null}
      <span>{children}</span>
      {iconEnd ? <span className="grid size-4 shrink-0 place-items-center" aria-hidden="true">{iconEnd}</span> : null}
    </button>
  );
}
