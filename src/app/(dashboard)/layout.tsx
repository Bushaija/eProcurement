'use client'
import Layout from "@/components/Layout";

export default function DashboardLayout ({ children, }: Readonly<{children: React.ReactNode}>){
    return (
        <div>
            <Layout>
                {children}
            </Layout>
        </div>
    );
}