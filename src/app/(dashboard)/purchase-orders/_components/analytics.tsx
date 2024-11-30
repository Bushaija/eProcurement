import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { BarGraph } from './charts/bar-graph'
import { RecentSales } from './charts/recent-sales'
import { AreaGraph } from './charts/area-graph'
import { PieGraph } from './charts/pi-graph'

export default function AnalyticsPage() {
  return (
    <section>
        <main className="flex gap-4">
            <Card className='w-1/2'>
                <CardHeader>
                    <CardTitle>Performance Mentrics</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-4 grid-cols-2'>
                    <div className='flex flex-col gap-4'>
                    <Card className='bg-[#F0EBFE] text-[#53389D] border-none outline-none'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Order Fulfillment Rate
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">58.23%</div>
                        <p className="text-xs text-muted-foreground">
                            how well suppliers meet the order quantities.
                        </p>
                        </CardContent>
                    </Card>

                    <Card className='bg-[#DDF5EB] text-[#3E8367] border-none outline-none'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            On-Time Delivery Rate
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            Meeting delivery deadlines.
                        </p>
                        </CardContent>
                    </Card>
                    </div>

                    <div className='flex flex-col gap-4'>
                    <Card className='bg-[#FBE6E6] text-[#C8627C] border-none outline-none'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Delivery Delay</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">26 days</div>
                        <p className="text-xs text-muted-foreground">
                            Measure delays in the delivery process
                        </p>
                        </CardContent>
                    </Card>
                
                <Card className='bg-[#FFF4D8] text-[#FE9C32] border-none outline-none'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Quantity Imbalance Rate
                    </CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">+57 %</div>
                    <p className="text-xs text-muted-foreground">
                        +201 since 6 month
                    </p>
                    </CardContent>
                </Card>
                    </div>    
                </CardContent>
            </Card>

            <Card className='w-1/2'>
                <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent className="col-span-4 md:col-span-3">
                    <PieGraph />
                </CardContent>
            </Card>
        </main>

            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div> */}
    </section>
  )
}
