import Image from "next/image";

const AuthTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen items-center justify-center flex flex-col gap-4 p-4">
      <div className="w-full flex justify-center items-center">
        <Image
          priority
          width={300}
          height={300}
          alt="Main logo"
          src="/assets/images/logo.webp"
          className="w-full max-w-[300px] h-auto"
        />
      </div>
      <div className="w-full flex flex-col items-center max-h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthTemplate;
