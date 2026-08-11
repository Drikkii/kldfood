import { useEffect, useId, useRef, useState } from "react";

type ReadyTimeSelectProps = {
  value: string;
  slots: string[];
  onChange: (value: string) => void;
  required?: boolean;
};

export function ReadyTimeSelect({ value, slots, onChange, required }: ReadyTimeSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="ready-time-select" ref={rootRef}>
      <button
        type="button"
        className="ready-time-select__trigger checkout-field__input"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <span className="ready-time-select__chevron" aria-hidden="true" />
      </button>
      {required && !value ? (
        <input className="ready-time-select__validator" tabIndex={-1} required value="" readOnly />
      ) : null}
      {open ? (
        <ul id={listId} className="ready-time-select__list" role="listbox" aria-label="Время готовности">
          {slots.map((slot) => (
            <li key={slot} role="none">
              <button
                type="button"
                role="option"
                aria-selected={slot === value}
                className={`ready-time-select__option${slot === value ? " is-active" : ""}`}
                onClick={() => {
                  onChange(slot);
                  setOpen(false);
                }}
              >
                {slot}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
