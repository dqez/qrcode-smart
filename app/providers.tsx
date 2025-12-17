"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

import { AuthProvider } from "@/context/AuthContext"

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextThemesProvider>
  )
}
