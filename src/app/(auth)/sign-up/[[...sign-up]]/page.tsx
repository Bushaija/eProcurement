import { Loader2 } from "lucide-react";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen  grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create account to get back to your dashboard!
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full hidden lg:flex items-center justify-center bg-[#F5ECFF] p-4">
        {/* <Image src="logo.svg" alt="Logo" width={100} height={100} /> */}
        <div>
            <p className="border-b-4 rounded-md border-[#4B0082]">
                <span className="text-[36px] font-bold text-blue-600">r</span>
                <span className="text-[36px] font-bold text-yellow-500">b</span>
                <span className="text-[36px] font-bold text-green-600">c</span>
                <span className="text-[18px] font-semibold text-[#4B0082] ml-4"><span>e</span>Procurement</span>
            </p>
            
        </div>
      </div>
    </div>
  );
}