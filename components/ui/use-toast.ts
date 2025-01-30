"use client"

import { toast } from "@/components/ui/toast"

export function useToast() {
  return {
    toast: (props) => toast(props),
    dismiss: () => {}, // Sonner handles dismissal automatically
  }
}

export { toast }