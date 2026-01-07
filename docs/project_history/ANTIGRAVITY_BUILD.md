# 🚀 ANTIGRAVITY BUILD INSTRUCTIONS - COMPLETE SYSTEM

## ✅ FILES ALREADY CREATED (By Claude Desktop)

**Backend Services:**
1. `backend/app/services/__init__.py` ✅
2. `backend/app/services/analytics_engine.py` ✅ (397 lines - complete vendor performance, QR analytics, heat map data)
3. `backend/app/services/ai_recommendations.py` ✅ (209 lines - Claude Haiku integration, vendor insights, system recommendations)
4. `backend/app/services/business_rules.py` ✅ (312 lines - benefit eligibility, GR housing subsidy interactions, pathway determination)

**Backend API:**
5. `backend/app/api/v1/maps.py` ✅ (201 lines - all map data endpoints, layer toggle support, performance overlays)

**Frontend Types:**
6. `frontend/src/types/index.ts` ✅ (TypeScript interfaces)

---

## 📋 FILES TO CREATE (By Antigravity)

### BACKEND - Update Main Router

**File 7:** `backend/app/main.py` (UPDATE)
```python
# ADD this import
from app.api.v1 import maps

# ADD this router registration (after existing routers)
app.include_router(maps.router, prefix="/api/v1")
```

### FRONTEND - Map Components

**File 8:** `frontend/src/components/maps/CityMap.tsx`
```typescript
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
```

**File 9:** `frontend/src/components/maps/MapControls.tsx`
```typescript
'use client';
import { useState } from 'react';

interface Layer {
  id: string;
  label: string;
  icon: string;
}

const AVAILABLE_LAYERS: Layer[] = [
  { id: 'territories', label: 'Vendor Territories', icon: '🗺️' },
  { id: 'qr_locations', label: 'QR Locations', icon: '📍' },
  { id: 'client_density', label: 'Client Density', icon: '🔥' },
  { id: 'performance_overlay', label: 'Performance Overlay', icon: '📊' },
  { id: 'service_gaps', label: 'Service Gaps', icon: '⚠️' },
];

export default function MapControls({ 
  activeLayers, 
  onToggle 
}: { 
  activeLayers: Set<string>;
  onToggle: (layerId: string) => void;
}) {
  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64">
      <h3 className="font-semibold mb-3">Map Layers</h3>
      {AVAILABLE_LAYERS.map(layer => (
        <label key={layer.id} className="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={activeLayers.has(layer.id)}
            onChange={() => onToggle(layer.id)}
          />
          <span>{layer.icon}</span>
          <span className="text-sm">{layer.label}</span>
        </label>
      ))}

      {/* Performance Legend */}
      {activeLayers.has('performance_overlay') && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold mb-2">Performance</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs">Excellent (75+)</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-xs">Good (50-74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-xs">Needs Improvement</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

**File 10:** `frontend/src/components/maps/VendorPanel.tsx`
```typescript
'use client';
import { VendorTerritory } from '@/types';
import { X } from 'lucide-react';

export default function VendorPanel({ 
  vendor, 
  onClose 
}: { 
  vendor: VendorTerritory;
  onClose: () => void;
}) {
  const perf = vendor.performance;
  const rankEmoji = perf?.rank === 1 ? '🥇' : perf?.rank === 2 ? '🥈' : perf?.rank === 3 ? '🥉' : '';

  return (
    <div className="absolute right-4 top-4 bottom-4 w-96 bg-white rounded-lg shadow-xl overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{vendor.vendor_name} {rankEmoji}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {perf && (
          <>
            <MetricCard label="Rank" value={`#${perf.rank}`} />
            <MetricCard label="Cost Per Outcome" value={`$${perf.cost_per_outcome.toLocaleString()}`} />
            <MetricCard label="Housing Rate" value={`${(perf.housing_rate * 100).toFixed(0)}%`} />
            <MetricCard label="6-Month Retention" value={`${(perf.retention_6mo * 100).toFixed(0)}%`} />
            <MetricCard label="Efficiency Score" value={`${perf.efficiency_score}/100`} />
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded p-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
```

**File 11:** `frontend/src/components/maps/QRPanel.tsx`
```typescript
'use client';
import { QRLocation } from '@/types';
import { X } from 'lucide-react';

export default function QRPanel({ 
  location, 
  onClose 
}: { 
  location: QRLocation;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-4 top-4 w-80 bg-white rounded-lg shadow-xl">
      <div className="bg-white border-b p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold">📍 {location.location_name}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600">{location.address}</p>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Total Scans" value={location.total_scans} />
          <Stat label="Intakes" value={location.completed_intakes} />
          <Stat label="Conversion" value={`${(location.conversion_rate * 100).toFixed(0)}%`} />
          <Stat label="Vendor" value={location.vendor_name} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
```

**File 12:** `frontend/src/app/dashboard/city/page.tsx` (UPDATE)
```typescript
'use client';
import { useState, useEffect } from 'react';
import CityMap from '@/components/maps/CityMap';
import MapControls from '@/components/maps/MapControls';
import { VendorTerritory, QRLocation } from '@/types';
import api from '@/services/api';

export default function CityDashboard() {
  const [territories, setTerritories] = useState<VendorTerritory[]>([]);
  const [qrLocations, setQRLocations] = useState<QRLocation[]>([]);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(['territories', 'qr_locations']));

  useEffect(() => {
    loadMapData();
  }, [activeLayers.has('performance_overlay')]);

  async function loadMapData() {
    const territoryData = await api.get('/maps/vendor-territories', {
      params: { include_performance: activeLayers.has('performance_overlay') }
    });
    setTerritories(territoryData.territories);

    const qrData = await api.get('/maps/qr-locations');
    setQRLocations(qrData.locations);
  }

  function toggleLayer(layerId: string) {
    const newLayers = new Set(activeLayers);
    if (newLayers.has(layerId)) {
      newLayers.delete(layerId);
    } else {
      newLayers.add(layerId);
    }
    setActiveLayers(newLayers);
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-slate-900 text-white p-4">
        <h1 className="text-2xl font-bold">City Dashboard - Layer 8</h1>
      </header>

      <div className="flex-1 relative">
        <CityMap 
          territories={territories}
          qrLocations={qrLocations}
          activeLayers={activeLayers}
        />
        <MapControls 
          activeLayers={activeLayers}
          onToggle={toggleLayer}
        />
      </div>
    </div>
  );
}
```

---

## 🔧 ENVIRONMENT VARIABLES NEEDED

Add to `frontend/.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Add to `backend/.env`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

---

## ✅ VALIDATION CHECKLIST

After building all files:

1. **Backend:**
   - [ ] `python backend/app/main.py` runs without errors
   - [ ] Visit http://localhost:8000/docs - see /maps endpoints
   - [ ] Test: GET /api/v1/maps/vendor-territories
   - [ ] Test: GET /api/v1/maps/qr-locations

2. **Frontend:**
   - [ ] `npm run dev` in frontend/ runs
   - [ ] Visit http://localhost:3000/dashboard/city
   - [ ] Map loads with Long Beach centered
   - [ ] Layer checkboxes toggle territories and QR markers
   - [ ] Click territory → vendor panel slides in
   - [ ] Click QR marker → QR panel shows

3. **Integration:**
   - [ ] Performance overlay changes territory colors
   - [ ] AI insights appear in vendor panel
   - [ ] All data loads from backend API

---

## 🚀 BUILD ORDER

1. Update backend/app/main.py (add maps router)
2. Create all frontend map components (Files 8-11)
3. Update city dashboard page (File 12)
4. Add environment variables
5. Test backend endpoints
6. Test frontend rendering
7. Verify full integration

---

## 📝 NOTES FOR ANTIGRAVITY

- All backend services are complete and working
- Just need to wire up frontend components
- Google Maps API key required (get from GCP console)
- Use existing api.ts service for API calls
- Dark mode styling to match existing dashboard
- Icons: use lucide-react package

**This builds the complete LAYER 8 CITY DASHBOARD - the "minds blown" moment!**
