import * as React from "react";
import Sidebar from "@/components/sidebar";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      <main className="w-screen h-screen flex">
        <div>
          <Sidebar/>
        </div>

        <div>

        </div>
      </main>
    </NextUIProvider>
  )
}
