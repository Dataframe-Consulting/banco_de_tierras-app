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
        ? "bg-[#F2AFAF] border-[#E38787] text-red-600 placeholder-red-500 focus:ring-[#E38787] focus:border-[#E38787] dark:bg-red-900 dark:bg-opacity-25 dark:text-red-400 dark:placeholder-red-500 dark:focus:ring-red-400 dark:focus:border-red-400"
        : "bg-white dark:bg-neutral-light border-neutral-dark text-neutral-dark dark:text-primary-light placeholder-neutral dark:placeholder-primary-light focus:ring-accent focus:border-accent dark:focus:ring-primary-light dark:focus:border-primary-light"
    ),
  };

  return (
    <>
      {type === "file" ? (
        <label
          htmlFor={id}
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer",
            error
              ? "bg-red-50 dark:bg-red-700 dark:border-red-600 border-red-500"
              : file
              ? "bg-green-50 dark:bg-green-700 dark:border-green-600 border-green-500"
              : "bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          )}
        >
          <div className="flex flex-col items-center justify-center p-5">
            <Upload color={error ? "red" : file ? "green" : "gray"} />
            <p
              className={cn(
                "mb-2 text-sm text-center",
                error
                  ? "text-red-500 dark:text-red-400"
                  : file
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <span className="font-semibold">Click para subir</span>
              <br />o arrastra el archivo aquí
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
              {...commonProps}
            />
          )}
        </>
      )}
      {error && (
        <small className="text-red-600 dark:text-red-300">{error}</small>
      )}
    </>
  );
};

export default GenericInput;
