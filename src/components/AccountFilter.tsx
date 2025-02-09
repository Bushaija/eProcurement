"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";
import qs from "query-string";

const sections = [
    {
        id: "planning",
        name: "PLANNING",
        url: "/planning"
    },
    {
        id: "implementation",
        name: "IMPLEMENTATION",
        url: "/implementation"
    },
]

export const AccountFilter = () => {
    const router = useRouter()
    const pathname = usePathname()

    const params = useSearchParams();
    const sectionId = params.get("sectionId") || "all" 
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const onChange= (newSection: string) => {
        const query = {
            sectionId: newSection,
            from,
            to,
        };
        if(newSection === "PLANNING") {
            query.sectionId = "planning"
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        },{ skipNull: true, skipEmptyString: true });

        router.push(url);
    }



    return (
        <Select
            value={sectionId}
            onValueChange={onChange}
        >
            <SelectTrigger className="w-[250px] h-9 rounded-md px-3 font-normal bg-[#f9f5f9] hover:bg-white border-none focus:ring-offset-0 border-2 focus:ring-transparent text-[#94A3B5] focus:bg-white/30 transition z-50 border-black">
                <SelectValue placeholder="Planning" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                {
                    sections?.map((section) => (
                        <SelectItem value={section.name} key={section.id} className="text-[#94A3B5]">
                            {section.name}
                        </SelectItem>
                    ))   
                } 
                </SelectGroup>
            </SelectContent>
        </Select>
      );
}
