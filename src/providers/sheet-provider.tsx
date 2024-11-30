"use client"

import NewApprovalSheet from "@/features/approvals/components/new-approval-sheet";
import EditInvoiceSheet from "@/features/invoices/components/edit-invoice-sheet";
import NewInvoiceSheet from "@/features/invoices/components/new-invoice-sheet";
import EditQuerySheet from "@/features/queries/components/edit-query-sheet";
import NewQuerySheet from "@/features/queries/components/new-query-sheet";
import { useEffect, useState } from "react";

export const SheetProvider = () => {
    // const isMounted = useMountedState();
    // if(!isMounted) return null;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <>
        <NewApprovalSheet />
        
        <NewInvoiceSheet />

        <EditInvoiceSheet />

        <EditQuerySheet />
        
        <NewQuerySheet />
    </>
}