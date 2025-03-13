"use client";

import { ErrorCard } from "@/app/shared/components";

const RentsErrorPage = () => {
  return (
    <div className="absolute top-0 left-0 sm:left-48 right-0 bottom-0 flex flex-col items-center justify-center p-4">
      <ErrorCard />
    </div>
  );
};

export default RentsErrorPage;
