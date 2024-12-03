import React, { Suspense } from 'react'
import CreatePurchaseOrder from './_components/new'

export default function page() {
  return (
    <Suspense>
      <CreatePurchaseOrder />
    </Suspense>
  )
}
