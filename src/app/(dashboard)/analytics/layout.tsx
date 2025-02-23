"use client"
// import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetFullData } from '@/features/analytics/api/use-get-full-data';
import React from 'react';

interface ETACardProps {
  overall: string
  overallDesc: string;
  rightVal: string
  rightTitle: string;
  leftVal: string
  leftTitle: string;
}

const StatsCard = ({ title, value, content }: { title: string, value: number, content?: string }) => {
  return <Card className='w-full'>
  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
    <CardTitle className='text-sm font-medium'>
      {title}
    </CardTitle>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      className='h-4 w-4 text-muted-foreground'
    >
      <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
    </svg>
  </CardHeader>
  <CardContent>
    <div className='text-2xl font-bold'>{value}</div>
    <p className='text-xs text-muted-foreground'>
      {content}
    </p>
  </CardContent>
</Card>
}

const ETACard = ({ overall, overallDesc, rightVal, rightTitle, leftVal, leftTitle }: ETACardProps) => {
  return <Card className='w-full'>
    <CardHeader className='flex flex-col items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-2xl font-bold'>{overall}</CardTitle>
      <CardDescription>{overallDesc}</CardDescription>
    </CardHeader>
    <CardContent className='flex items-center justify-between h-[100px] w-full'>
      <div className="flex flex-col justify-center items-center text-center w-full">
        <CardTitle className='text-2xl font-bold'>{rightVal}</CardTitle>
        <CardDescription>{rightTitle}</CardDescription>
      </div>

      <Separator orientation='vertical' />

      <div className="flex flex-col justify-center items-center text-center w-full">
        <CardTitle className='text-2xl font-bold'>{leftVal}</CardTitle>
        <CardDescription>{leftTitle}</CardDescription>
      </div>
    </CardContent>
  </Card>
}

export default function OverViewLayout({
  line_stats,
  pie_stats,
  bar_stats,
  late_stats,
  int_pie_stats,
}: {
  line_stats: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  late_stats: React.ReactNode;
  int_pie_stats: React.ReactNode;
}) {
  const { data, isLoading, error } = useGetFullData();

  if (isLoading) return <p>Loading shipments...</p>;
  if (error) return <p>Error fetching shipments: {error.message}</p>;

  console.log("data: ", data)

  return (
    <div>
      <div className='flex flex-col gap-4 grid-rows-2'>
        <div className='flex gap-4'>
          <ETACard 
            overall="75.28%"
            overallDesc="On-time delivery"
            rightVal="24"
            rightTitle="On-time"
            leftVal="48"
            leftTitle="Delivered"
          />

          <ETACard 
            overall="48"
            overallDesc="Shipment Items"
            rightVal="14"
            rightTitle="Open"
            leftVal="26"
            leftTitle="Received"
          />


          <StatsCard 
            title='Open Purchase Orders'
            value={18}
          />

          <StatsCard 
            title='Overdue Shipments'
            value={+20}
          />

        </div>

        <div className='grid auto-rows-min gap-4 md:grid-cols-3 '>
          <div className='aspect-video'>{int_pie_stats}</div>
          <div className='h-full'>{bar_stats}</div>
          <div className='aspect-video'>{pie_stats}</div>
        </div>

         <div className='grid grid-flow-col grid-rows-3 gap-4'>
          <div className=''>{line_stats}</div>
        </div>
      </div>
    </div>
  );
}
