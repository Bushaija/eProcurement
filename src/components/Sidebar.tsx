import { AnalyticsIcon, DashboardLogo, OrderIcon, PaperPlaneIcon, PurchaseOrderIcon, SettingsIcon } from "@/assets/icons/icons";
import { NavButton } from "@/components/nav-button";
// import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {}

const routes = [
  {
    href: "/",
    label: "Dashboard",
    icon: <DashboardLogo />
  },
  {
    href: "/purchase-orders",
    label: "Purchase Orders",
    disabled: false,
    icon: <PaperPlaneIcon />
  },
  {
    href: "/reviews",
    label: "Reviews",
    disabled: false,
    icon: <PurchaseOrderIcon />
  },
  // {
  //   href: "/invoice",
  //   label: "Invoice",
  //   disabled: false,
  //   icon: <OrderIcon />
  // },
  // {
  //   href: "/#",
  //   label: "Settings",
  //   disabled: true,
  //   icon: <SettingsIcon />
  // },
]

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  return (
    <div className="w-[260px] bg-white min-h-[100vh] max-sm:w-full max-sm:p-5 max-sm:min-h-[2vh] max-sm:fixed max-sm:bottom-0 max-sm:bg-white max-sm:shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.05)] max-sm:z-[100]">
      <div className="py-10 px-[40px] max-sm:hidden">
        <div className="bg-[#F5ECFF] rounded-full">
            <p className="border-l-2 border-[#5F01D2] rounded-full flex items-center justify-center">
                <span className="text-[24px] font-bold text-blue-600">r</span>
                <span className="text-[24px] font-bold text-yellow-500">b</span>
                <span className="text-[24px] font-bold text-green-600">c</span>
                <span className="text-[16px] font-semibold text-[#5F01D2] ml-2"><span>e</span>Procurement</span>
            </p>
            
        </div>
      </div>
      <div className="flex flex-col gap-6 max-sm:flex-row max-sm:gap-3 max-sm:overflow-scroll">
        {
          routes.map((route) => (
            <NavButton 
              key={route.label}
              href={route.href}
              label={route.label}
              icon={route.icon}
              disabled={route.disabled!}
            />
          ))
        }
      </div>
    </div>
  );
};

export default Sidebar;
