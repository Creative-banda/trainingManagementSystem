'use client'
import AppNavbar from "@/components/navbar";
import AppSidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <main className="flex h-screen w-screen gap-4">
            <div className="border">
                <AppSidebar />
            </div>

            <div className="flex flex-col gap-4 w-full h-full">
                <div className="border rounded-md">
                    <AppNavbar />
                </div>
                <div className="">
                    {children}
                </div>
            </div>
        </main>
    )
}