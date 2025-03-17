"use client";

import React from 'react';
import { KpiCard, KpiItem } from '@/components/charts/kpi-card';
import { DonutChart } from '@/components/charts/donut-chart';
import { BarChart } from '@/components/charts/bar-chart-new';
import { KpiEntry, ProgressBarCard } from '@/components/charts/ui/progress-bar-card';
import { Card } from '@/components/ui/card';

const dataByFunders = [
  {
    name: 'WHO',
    amount: 6730,
    share: '32.1%',
    color: 'bg-cyan-500',
  },
  {
    name: 'TBD',
    amount: 4120,
    share: '19.6%',
    color: 'bg-blue-500',
  },
  {
    name: 'ENABEL',
    amount: 3920,
    share: '18.6%',
    color: 'bg-indigo-500',
  },
  {
    name: 'GF',
    amount: 3210,
    share: '15.3%',
    color: 'bg-violet-500',
  },
  {
    name: 'USAID',
    amount: 3010,
    share: '14.3%',
    color: 'bg-fuchsia-500',
  },
];

const dataByDivisions = [
  {
    name: 'MCCH',
    amount: 5710,
    share: '27.2%',
    color: 'bg-cyan-500',
  },
  {
    name: 'HIV/MALARIA',
    amount: 4940,
    share: '23.5%',
    color: 'bg-blue-500',
  },
  {
    name: 'TB',
    amount: 4523,
    share: '21.5%',
    color: 'bg-indigo-500',
  },
  {
    name: 'NCD',
    amount: 3240,
    share: '15.4%',
    color: 'bg-violet-500',
  },
  {
    name: 'NLAB',
    amount: 2577,
    share: '12.3%',
    color: 'bg-fuchsia-500',
  },
];

const data: KpiEntry[] = [
  {
    title: "Closed shipments",
    percentage: 48.1,
    count: 23.44,
    total: 60,
  },
  {
    title: "Open shipments",
    percentage: 40,
    count: 65.40,
    total: 60,
  },
  {
    title: "Delayed shipments",
    percentage: 5.66,
    count: 5,
    total: 60,
  },
]

// Define categories
const categories = [
  {
    name: 'Funders',
    data: dataByFunders,
  },
  {
    name: 'Divisions',
    data: dataByDivisions,
  },
];

const chartdata = [
  {
    division: "RIDS",
    delayed: 1890,    
    open: 1890,
    closed: 1338,
  },
  {
    division: "MCCH",
    delayed: 2890,    
    open: 2890,
    closed: 2338,
  },
  // {
  //   date: "Feb 23",
  //   SolarPanels: 2756,
  //   Inverters: 2103,
  // },
  // {
  //   date: "Mar 23",
  //   SolarPanels: 3322,
  //   Inverters: 2194,
  // },
  // {
  //   date: "Apr 23",
  //   SolarPanels: 3470,
  //   Inverters: 2108,
  // },
  // {
  //   date: "May 23",
  //   SolarPanels: 3475,
  //   Inverters: 1812,
  // },
  // {
  //   date: "Jun 23",
  //   SolarPanels: 3129,
  //   Inverters: 1726,
  // },
  // {
  //   date: "Jul 23",
  //   SolarPanels: 3490,
  //   Inverters: 1982,
  // },
  // {
  //   date: "Aug 23",
  //   SolarPanels: 2903,
  //   Inverters: 2012,
  // },
  // {
  //   date: "Sep 23",
  //   SolarPanels: 2643,
  //   Inverters: 2342,
  // },
  // {
  //   date: "Oct 23",
  //   SolarPanels: 2837,
  //   Inverters: 2473,
  // },
  // {
  //   date: "Nov 23",
  //   SolarPanels: 2954,
  //   Inverters: 3848,
  // },
  // {
  //   date: "Dec 23",
  //   SolarPanels: 3239,
  //   Inverters: 3736,
  // },
]


const currencyFormatter = (number: number) => {
  return Intl.NumberFormat('us').format(number).toString();
};

const Home = () => {
  const kpiData: KpiItem[] = [
    {
      id: '0',
      name: 'Shipments Received',
      count: 23,
    },
    {
      id: '1',
      name: 'Shipments Ordered',
      count: 33,
    },
    {
      id: '2',
      name: 'Shipments Cancelled',
      count: 4,
    },
    {
      id: '3',
      name: 'Shipments on Hold',
      count: 2,
    },
  ];

  return (
    <section className='flex flex-col gap-4 w-full max-w-[1180px] mx-auto'>
      <div className="grid grid-cols-2 gap-4">
        <div className='flex justify-center items-center max-w-[590px] w-full'>
          <KpiCard data={kpiData} />
        </div>
        
        <Card>
          <DonutChart
            title="Costs breakdown"
            description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr."
            categories={categories}
            valueFormatter={currencyFormatter}
            colors={['cyan', 'blue', 'indigo', 'violet', 'fuchsia']}
            showTooltip={true}
            cardProps={{ className: "h-full w-full p-6" }}
          />
        </Card>
      </div>
      <div className='grid grid-cols-2 gap-4 w-full'>
        <Card className='w-full p-8'>
          <BarChart
            className="h-80 max-w-[720px]"
            data={chartdata}
            index="division"
            categories={["open", "delayed", "closed"]}
            // valueFormatter={(number: number) =>
            //   `$${Intl.NumberFormat("us").format(number).toString()}`
            // }
            onValueChange={(v) => console.log(v)}
            xAxisLabel="Division"
            yAxisLabel="Count"
          />
        </Card>
        <Card className='w-full p-12'>
          <ProgressBarCard
            title="Shipments Tracker"
            change="+0.2%"
            value="68.1%"
            valueDescription="on time delivery"
            ctaDescription="Monthly tracker resets in 12 days."
            ctaText="Manage plan."
            ctaLink="#"
            data={data}
          />
         </Card>
      </div>
    </section>
  );
};

export default Home;