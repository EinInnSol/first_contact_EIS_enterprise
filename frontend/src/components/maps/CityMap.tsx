'use client';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Circle, Marker } from '@react-google-maps/api';
import { VendorTerritory, QRLocation } from '@/types';
import VendorPanel from './VendorPanel';
import QRPanel from './QRPanel';

export default function CityMap({ 
  territories, 
  qrLocations, 
  activeLayers 
}: { 
  territories: VendorTerritory[];
  qrLocations: QRLocation[];
  activeLayers: Set<string>;
}) {
  const [selectedVendor, setSelectedVendor] = useState<VendorTerritory | null>(null);
  const [selectedQR, setSelectedQR] = useState<QRLocation | null>(null);

  const mapCenter = { lat: 33.7701, lng: -118.1937 }; // Long Beach

  return (
    <div className="relative w-full h-full">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={12}
          options={{
            styles: [], // Add custom map styles
            disableDefaultUI: false,
            zoomControl: true,
          }}
        >
          {/* Vendor Territories */}
          {activeLayers.has('territories') && territories.map(territory => {
            const fillColor = activeLayers.has('performance_overlay') 
              ? getPerformanceColor(territory.performance?.efficiency_score || 0)
              : territory.color;

            return (
              <Circle
                key={territory.vendor_id}
                center={territory.center}
                radius={territory.radius}
                options={{
                  fillColor,
                  fillOpacity: 0.2,
                  strokeColor: fillColor,
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                  clickable: true,
                }}
                onClick={() => setSelectedVendor(territory)}
              />
            );
          })}

          {/* QR Code Locations */}
          {activeLayers.has('qr_locations') && qrLocations.map(location => (
            <Marker
              key={location.location_id}
              position={{ lat: location.latitude, lng: location.longitude }}
              onClick={() => setSelectedQR(location)}
              icon={{
                url: '/icons/qr-marker.svg',
                scaledSize: new google.maps.Size(32, 32),
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Vendor Detail Panel */}
      {selectedVendor && (
        <VendorPanel 
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}

      {/* QR Location Panel */}
      {selectedQR && (
        <QRPanel
          location={selectedQR}
          onClose={() => setSelectedQR(null)}
        />
      )}
    </div>
  );
}

function getPerformanceColor(score: number): string {
  if (score >= 75) return '#10B981'; // Green
  if (score >= 50) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
}
