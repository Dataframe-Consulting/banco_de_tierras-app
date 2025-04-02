"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { ErrorCard } from "@/app/shared/components";

const AuthErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };
  return (
    <>
      <ErrorCard isComponent message={error.message} />
      <button
        type="button"
        onClick={reload}
        className="text-white px-4 py-2 rounded-md w-auto transition-colors duration-300 border bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
      >
        Try again
      </button>
    </>
  );
};

export default AuthErrorPage;
