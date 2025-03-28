"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import NavButton from "./NavButton";

const routes = [
  {
    href: "/",
    label: "Verification",
  },
  {
    href: "/approval",
    label: "Approval",
  },
  {
    href: "/initialize-payment",
    label: "Payment",
  },

  // {
  //   href: "/categories",
  //   label: "Categories",
  // },
  // {
  //   href: "/settings",
  //   label: "Settings",
  // },
];

const Navigation = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // const router = useRouter();
  const pathname = usePathname();
  // const isMobile = useMedia("(max-width: 1024px)", false);

  // const onClick = (href: string) => {
  //   router.push(href);
  //   setIsOpen(false);
  // };

  // if (isMobile) {
  //   return (
  //     <Sheet open={isOpen} onOpenChange={setIsOpen}>
  //       <SheetTrigger>
  //         <Button
  //           size="sm"
  //           variant="outline"
  //           className=" font-normal text-white/10 bg-white/20 hover:text-black border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
  //         >
  //           <Menu className="size-4" />
  //         </Button>
  //       </SheetTrigger>
  //       <SheetContent side="left" className="px-2">
  //         <nav className="flex flex-col gap-y-2 pt-6">
  //           {routes.map((route) => (
  //             <Button
  //               key={route.href}
  //               variant={route.href === pathname ? "secondary" : "ghost"}
  //               onClick={() => onClick(route.href)}
  //               className="w-full justify-start"
  //             >
  //               {route.label}
  //             </Button>
  //           ))}
  //         </nav>
  //       </SheetContent>
  //     </Sheet>
  //   );
  // }

  return (
    <nav
      className="flex items-center gap-x-2 
    overflow-x-auto"
    >
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
