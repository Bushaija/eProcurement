import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";


type Props = {
    href: string;
    label: string;
    isActive?: boolean;
}

const NavButton = ({
    href,
    label,
    isActive
}: Props) => {
  return (
    <Button
        asChild
        size="sm"
        variant="outline"
        className={cn(
            "w-full justify-between font-normal text-[1rem] rounded-none hover:bg-white hover:text-[#5F01D2] hover:border-b-4 hover:border-b-[#5F01D2] focus-visible:ring-offset-0 focus-visible:ring-transparent text-[#667185] focus:border-b-4 focus:border-b-[#5F01D2] focus:text-[#5F01D2] focus:bg-white transition p-2 border-2 border-[#5F01D2]",
            isActive ? "bg-white/10 text-[#667185]" : "bg-transparent",

        )}
    >
        <Link href={`/invoice/${href}`}>
            {label}
        </Link> 
    </Button>
  )
}

export default NavButton