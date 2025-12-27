"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface VendorTerritory {
  vendor_id: number
  vendor_name: string
  center: { lat: number; lng: number }
  radius: number
  color: string
  performance?: {
    housing_rate: number
    cost_per_outcome: number
    efficiency_score: number
  }
}

interface QRLocation {
  id: string
  name: string
  lat: number
  lng: number
  scan_count: number
  conversion_rate: number
}

interface MapProps {
  territories: VendorTerritory[]
  qrLocations: QRLocation[]
  center?: { lat: number; lng: number }
}

export function CityMapView({ territories, qrLocations, center }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
        libraries: ["places", "visualization"],
      })

      const { Map } = await loader.importLibrary("maps")
      
      const mapCenter = center || { lat: 33.7701, lng: -118.1937 } // Long Beach default

      const mapInstance = new Map(mapRef.current as HTMLElement, {
        center: mapCenter,
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      })

      // Draw vendor territories as circles
      territories.forEach((territory) => {
        const circle = new google.maps.Circle({
          strokeColor: territory.color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: territory.color,
          fillOpacity: 0.15,
          map: mapInstance,
          center: territory.center,
          radius: territory.radius,
        })

        // Info window for territory
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm mb-1">${territory.vendor_name}</h3>
              ${territory.performance ? `
                <div class="text-xs space-y-1">
                  <div>Housing Rate: ${(territory.performance.housing_rate * 100).toFixed(1)}%</div>
                  <div>Cost/Outcome: $${territory.performance.cost_per_outcome.toLocaleString()}</div>
                  <div>Efficiency: ${territory.performance.efficiency_score}/100</div>
                </div>
              ` : ''}
            </div>
          `,
        })

        circle.addListener("click", () => {
          infoWindow.setPosition(territory.center)
          infoWindow.open(mapInstance)
        })
      })

      // Place QR location markers
      qrLocations.forEach((location) => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstance,
          title: location.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: location.conversion_rate > 0.7 ? "#10B981" : location.conversion_rate > 0.4 ? "#F59E0B" : "#EF4444",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm mb-1">${location.name}</h3>
              <div class="text-xs space-y-1">
                <div>Scans: ${location.scan_count}</div>
                <div>Conversion: ${(location.conversion_rate * 100).toFixed(1)}%</div>
              </div>
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstance, marker)
        })
      })

      setMap(mapInstance)
      setLoading(false)
    }

    initMap()
  }, [territories, qrLocations, center])

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
          <div className="text-sm text-slate-600 dark:text-slate-400">Loading map...</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}
