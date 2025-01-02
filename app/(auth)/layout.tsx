import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full-brand.png"
            alt="logo"
            width={300}
            height={50}
            className="h-auto"
            style={{ marginTop: -100, marginLeft: -50 }}
          />

          <div className="space-y-5 text-white" style={{ marginTop: -80 }}>
            <h1 className="h1">Manage your files efficiently</h1>
            <p className="body-1">
              This is a place where you can store your files and access them
              from anywhere.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
        <Image
            src="/assets/icons/logo-full.png"
            alt="logo"
            width={300}
            height={50}
            className="h-auto w-[300px] lg:w-[350px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
