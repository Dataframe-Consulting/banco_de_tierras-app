import cn from "@/app/shared/utils/cn";
import { IGenericIcon } from "@/app/shared/interfaces";

const colorMap: { [key: string]: string } = {
  gray: "text-gray-500 dark:text-gray-400",
  red: "text-red-500 dark:text-red-400",
  green: "text-green-500 dark:text-green-400",
};

interface IUpload extends IGenericIcon {
  color?: "gray" | "red" | "green";
}

const Upload = ({
  customClass,
  color = "gray",
  size = "size-6",
  strokeWidth = 1.5,
}: IUpload) => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth={strokeWidth}
      viewBox="0 0 20 16"
      className={cn(size, customClass, colorMap[color])}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
  );
};

export default Upload;
