import PageContainer from "@/components/layout/page-container";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import AnalyticsPage from "./analytics";
import PurchaseOrdersPage from "./purchaseOrders";

export default function overview() {
  return (
    <PageContainer>
        <Tabs defaultValue="purchase-orders" className="space-y-4">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground bg-[#F0EBFE] text-[#5F01D2]">
                <TabsTrigger 
                    value="purchase-orders"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                    All purchase orders
                </TabsTrigger>

                <TabsTrigger 
                    value="analytics"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                    Analytics
                </TabsTrigger>
            </TabsList>
            <TabsContent value="purchase-orders" className="space-y-4">
                <PurchaseOrdersPage />
            </TabsContent>
            
            {/* <TabsContent value="analytics" className="space-y-4">
                <AnalyticsPage/>
            </TabsContent> */}
        </Tabs>
    </PageContainer>
  )
}
