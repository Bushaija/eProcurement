import React, { Suspense } from 'react'
import Overview from './_components/overview';

export const metadata = {
  title: 'PO | Overview'
};

export default function IndexPage() {

  return <Suspense>
    <Overview />
  </Suspense>
};
