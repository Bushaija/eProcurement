import PageContainer from "@/components/layout/page-container";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import ExecutionStatusAnalysis from "./_components/execution-status-analysis/execution-status-analysis";
import CostAnalysis from "./_components/cost-analysis/cost-analysis";
import ShipmentAnalysis from "./_components/shipment-analysis.ts/shipment-analysis";

export const metadata = {
    title: 'PO | Analytics',
}

const analyticsTabs = [
    {
        id: 3,
        label: "Execution Status",
        value: "execution-status"
    },
    {
        id: 1,
        label: "Cost Analysis",
        value: "cost-analysis"
    },
    {
        id: 2,
        label: "Shipment",
        value: "shipment"
    },
];

export default function page() {
  return (
    <PageContainer>
        <Tabs defaultValue="execution-status" className="space-y-4">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground bg-[#F0EBFE] text-[#5F01D2]">
                {
                    analyticsTabs.map((tab) => {
                        return (
                            <TabsTrigger 
                                key={tab.id}
                                value={tab.value}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                            >
                                {tab.label}
                            </TabsTrigger>
                        )
                    })
                }
            </TabsList>
            <TabsContent value="execution-status" className="space-y-4">
                <ExecutionStatusAnalysis />
            </TabsContent>

            <TabsContent value="cost-analysis" className="space-y-4">
                <CostAnalysis />
            </TabsContent>

            <TabsContent value="shipment" className="space-y-4">
                <ShipmentAnalysis />
            </TabsContent>
           
        </Tabs>
    </PageContainer>
  )
};
