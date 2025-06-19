import cn from "@/app/shared/utils/cn";
import { Upload } from "@/app/shared/icons";

interface IGenericInput {
  id: string;
  ariaLabel: string;
  type: string;
  file?: File | null;
  fileAccept?: string;
  multiple?: boolean;
  step?: string;
  min?: string;
  max?: string;
  rows?: number;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  defaultChecked?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  error?: string;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const GenericInput: React.FC<IGenericInput> = ({
  id,
  ariaLabel,
  type,
  file,
  fileAccept,
  autoComplete,
  step,
  min,
  multiple,
  max,
  rows = 3,
  options,
  defaultValue,
  defaultChecked,
  placeholder,
  className = "",
  labelClassName = "",
  error,
  onChange,
  onKeyDown,
}) => {
  const commonProps = {
    id,
    name: id,
    autoComplete,
    onChange,
    defaultValue,
    "aria-label": ariaLabel,
    className: cn(
      "border p-2.5 text-sm rounded-lg",
      type === "checkbox" ? "cursor-pointer" : "w-full",
      className,
      error
        ? "bg-[#F2AFAF] border-[#E38787] text-red-600 placeholder-red-500 focus:ring-[#E38787] focus:border-[#E38787]"
        : "bg-white border-neutral-dark text-neutral-dark placeholder-neutral focus:ring-accent focus:border-accent"
    ),
  };

  return (
    <>
      {type === "file" ? (
        <label
          htmlFor={id}
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-black border-dashed rounded-lg cursor-pointer",
            error
              ? "bg-red-50 border-red-500"
              : file
              ? "bg-green-50 border-green-500"
              : "bg-gray-50 hover:bg-gray-100"
          )}
        >
          <div className="flex flex-col items-center justify-center p-5">
            <Upload color={error ? "red" : file ? "green" : "gray"} />
            <p
              className={cn(
                "mb-2 text-sm text-center",
                error
                  ? "text-red-500"
                  : file
                  ? "text-green-500"
                  : "text-gray-500"
              )}
            >
              <span className="font-semibold">Click para subir</span>
              <br />o arrastra los archivos aquí
            </p>
          </div>
          <input
            id={id}
            multiple={multiple}
            name={id}
            type="file"
            className="hidden"
            accept={fileAccept}
            onChange={onChange}
          />
        </label>
      ) : (
        <>
          <label htmlFor={id} className={labelClassName}>
            {ariaLabel}
          </label>
          {type === "textarea" ? (
            <textarea placeholder={placeholder} rows={rows} {...commonProps} />
          ) : type === "select" && options ? (
            <select {...commonProps}>
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              placeholder={placeholder}
              type={type}
              step={step}
              min={min}
              max={max}
              defaultChecked={defaultChecked}
              onKeyDown={onKeyDown}
              {...commonProps}
            />
          )}
        </>
      )}
      {error && <small className="text-red-600">{error}</small>}
    </>
  );
};

export default GenericInput;
