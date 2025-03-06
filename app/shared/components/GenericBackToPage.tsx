import Link from "next/link";
import cn from "@/app/shared/utils/cn";

interface IGenericBackToPage {
  link: string;
  title: string;
  linkText: string;
  description: string;
  customClass?: string;
}

const GenericBackToPage = ({
  link,
  title,
  linkText,
  description,
  customClass,
}: IGenericBackToPage) => {
  return (
    <section
      className={cn(
        customClass,
        "flex flex-col h-screen items-center justify-center px-4 pb-4 text-center"
      )}
    >
      <h1 className="text-3xl md:text-6xl font-bold">{title}</h1>
      <p className="text-gray-500 text-xl md:text-3xl">{description}</p>
      <Link href={link} className="link-button-blue text-base md:text-xl mt-4">
        {linkText}
      </Link>
    </section>
  );
};

export default GenericBackToPage;
