import { InputText, InputTextProps } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import React, { forwardRef } from "react";
import Field from "./Field";

interface Props extends InputTextProps {
  id: string;
  label: string;
  placeholder?: string;
  leftIcon?: string;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  helperText?: string;
  showCheck?: boolean;
  loading?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      placeholder,
      leftIcon,
      disabled,
      helperText,
      showCheck,
      loading,
      errorMessage,
      ...inputTextProps
    },
    ref
  ) => {
    return (
      <Field htmlFor={id} label={label}>
        <div className="relative flex">
          <div
            className="absolute h-full top-0 flex align-items-center text-600 pointer-events-none"
            style={{ left: "0.7rem" }}
          >
            <InputIcon className={`${leftIcon ? leftIcon : "hidden"}`} />
          </div>
          <InputText
            id={id}
            disabled={disabled}
            className={`w-full ${leftIcon ? "pl-5" : ""} ${
              loading || showCheck ? "pr-5" : ""
            }`}
            placeholder={placeholder}
            ref={ref}
            {...inputTextProps}
          />

          {(loading || showCheck) && (
            <div
              className="absolute h-full top-0 flex align-items-center pointer-events-none"
              style={{ right: "0.75em" }}
            >
              {loading ? (
                <span className="pi pi pi-spin pi-spinner text-500 text-sm "></span>
              ) : (
                <span className="bg-green-400 p-1 border-circle inline-flex align-items-center justify-content-center box-size-3 fadein">
                  <span className="pi pi-check text-white text-sm "></span>
                </span>
              )}
            </div>
          )}
        </div>

        {!errorMessage && helperText && (
          <span id={`${id}-help`} className="text-xs text-600">
            <i className="pi pi-info-circle text-xs"></i> {helperText}
          </span>
        )}
        {errorMessage && (
          <span id={`${id}-error`} className="text-xs text-red-600 fadeindown">
            <i className="pi pi-exclamation-circle text-xs"></i> {errorMessage}
          </span>
        )}
      </Field>
    );
  }
);
export default TextField;
