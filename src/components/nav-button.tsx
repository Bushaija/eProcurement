import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    href: string;
    label: string;
    icon: ReactNode,
    disabled: boolean
}

export const NavButton = ({
    href, label, icon, disabled
}:Props) => {
    return (
        <button className="flex gap-1 sidebar-nav text-[#666666]">
          <span className="flex gap-1 pl-[30px] bg-span max-sm:pl-2 max-sm:pr-4">
            <span>
              {icon}
            </span>
              {disabled ?
                (
                  <span>{label}</span>
                ):
                (<Link href={href} className="w-full text-left">
                    {label}
                </Link>)
              }
          </span>
        </button>
    )
}