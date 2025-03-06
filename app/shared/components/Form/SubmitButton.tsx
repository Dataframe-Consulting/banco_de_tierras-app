"use client";

import cn from "@/app/shared/utils/cn";
import { Spinner } from "@/app/shared/icons";

const colorMap: { [key: string]: string } = {
  red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
  blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
  green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
};

interface ISubmitButton {
  title: string;
  pending: boolean;
  color?: "red" | "blue" | "green";
}

const SubmitButton: React.FC<ISubmitButton> = ({
  title,
  pending,
  color = "blue",
}) => {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "px-4 py-2 rounded-md w-auto transition-colors duration-300 border",
        pending ? `${colorMap[color]}/50` : colorMap[color]
      )}
    >
      {pending ? <Spinner color={color} /> : title}
    </button>
  );
};

export default SubmitButton;
