"use client"
import PageContainer from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading';
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
// import { searchParamsCache } from "@/lib/searchParams";

import Link from "next/link";
import { buttonVariants } from '@/components/ui/button';
import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
import { cn } from '@/lib/utils';
import PurchaseOrderTable from "./purchase-order-table";



type TPurchaseOrderListingPage = {}

export default function PurchaseOrderListingPage({}: TPurchaseOrderListingPage) {
    // const [isLoading, setIsLoading] = useState(false);
    // const router = useRouter();

    // const page = searchParamsCache.get('page')
    // const search = searchParamsCache.get('q');
    // const department = searchParamsCache.get('department');
    // const pageLimit = searchParamsCache.get('limit')

    // const filters = {
    //     page,
    //     limit: pageLimit,
    //     ...(search && { search }),
    //     ...(department && { departments: department }),
    // };

    const purchaseOrdersQuery = useGetPurchaseOrders();
    const purchaseOrders = purchaseOrdersQuery.data || [];

    // const handleClick = async () => {
    //     setIsLoading(true);
    //     // await router.push("/purchase-orders/new");
    //     setIsLoading(false);
    // };
    
    return (
        <PageContainer>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={"Purchase Orders"}
                        description="Manage employees (Server side table functionalities.)"
                    />
                        <Link
                            href={'/purchase-orders/new'}
                            className={cn(buttonVariants({ variant: 'default' }))}
                        >
                            <Plus className="mr-2 h-4 w-4" /> 
                            Add New
                        </Link>
                        {/* <Button
                            onClick={handleClick}
                            disabled={isLoading}
                            className="bg-[rgb(114,1,253)] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
                        >
                            {
                            isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : ("Create Purchase Order")
                            }
                        </Button> */}
                </div>
                <Separator />
                <PurchaseOrderTable data={purchaseOrders} totalData={purchaseOrders.length} />
            </div>
        </PageContainer>
    )

}