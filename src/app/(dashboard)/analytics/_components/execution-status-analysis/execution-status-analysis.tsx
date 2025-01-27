import React from 'react';
import { StatusCard } from '../cards/radial-card';

const ExecutionStatusAnalysis = () => {
  const statuses = ["ORDERED", "CANCELLED", "RECEIVED", "HOLD", "PARTIAL RECEIVED"];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {statuses.map((status) => (
      <StatusCard key={status} status={status} />
    ))}
  </div>
  );
}



export default ExecutionStatusAnalysis