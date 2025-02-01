"use client";
import { useState } from "react"
import { MapPin } from "lucide-react"

interface MapPreviewProps {
  address?: string
  latitude?: number
  longitude?: number
}

export function MapPreview({ address, latitude, longitude }: MapPreviewProps) {
  const [loading, setLoading] = useState(false)

  const defaultCoordinates = {
    lat: latitude || 15.4577,  // Dharwad, Karnataka (default)
    lng: longitude || 75.0078,
  }
  const zoomLevel = 0.001;
  // Static map URL using OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${defaultCoordinates.lng - 0.00001},${defaultCoordinates.lat - 0.00001},${defaultCoordinates.lng + 0.00001},${defaultCoordinates.lat + 0.00001}&layer=mapnik&zoom=18`

  return (
    <div className="space-y-2"> 
      <div className="relative w-full h-[300px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
            <MapPin className="h-6 w-6 animate-pulse text-primary" />
          </div>
        )}
        <iframe
          src={mapUrl}
          className="w-full h-full rounded-md"
          onLoad={() => setLoading(false)}
          style={{ border: 0 }}
          title="Static Map"
        />
      </div>
    </div>
  )
}