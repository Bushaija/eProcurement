'use client';

import React, { Suspense } from 'react';
import { ShipmentTable } from './shipment-table';

export function ShipmentTableWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShipmentTable />
    </Suspense>
  );
} 