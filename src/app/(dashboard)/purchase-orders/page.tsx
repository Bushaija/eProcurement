import React, { Suspense } from 'react'
import Overview from './_components/overview';

// new
// import { type SearchParams } from '@/types';
// import { searchParamsCache } from '@/lib/searchParams';
// import PurchaseOrderListingPage from './_components/purchase-order-listing-page';

export const metadata = {
  title: 'PO | Overview'
};

// type pageProps = {
//   searchParams: SearchParams;
// };


export default function IndexPage() {
  // searchParamsCache.parse(searchParams);

  return <Suspense>
    <Overview />
  </Suspense>
};
