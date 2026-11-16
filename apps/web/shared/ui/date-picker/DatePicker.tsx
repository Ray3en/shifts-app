type DatePickerProps = { value: string; onChange: (value: string) => void };

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <label className="flex h-12 items-center rounded-xl bg-[#f2f3f7] px-3 text-sm text-[#737378]">
      <input aria-label="Дата календаря" type="date" value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent font-medium text-[#101012] outline-none" />
    </label>
  );
}
