import Sidebar from "@/components/sidebar"
import Topbar from "@/components/topbar"
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/highlight/lib/styles/index.css"

import { ProjectProvider } from "@/providers/project-provider"
import { UserProvider } from "@/providers/user-provider"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 500 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 500 900",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <UserProvider>
          <BreadcrumbProvider>
            <ProjectProvider>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden ml-16">
                  <Topbar />
                  <main className="flex-1 overflow-auto p-4">{children}</main>
                </div>
              </div>
            </ProjectProvider>
          </BreadcrumbProvider>
        </UserProvider>
      </body>
    </html>
  )
}
