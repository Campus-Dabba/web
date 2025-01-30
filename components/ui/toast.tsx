"use client"
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner"

export { SonnerToaster as ToastProvider }

export function toast({ title, description, variant = "default", ...props }) {
  const toastFn = variant === "destructive" ? sonnerToast.error : sonnerToast
  return toastFn(title, {
    description,
    ...props,
  })
}

// Export empty components to maintain API compatibility
export const ToastViewport = () => null
export const ToastClose = () => null
export const ToastTitle = () => null 
export const ToastDescription = () => null
export const ToastAction = () => null
export const Toast = () => null