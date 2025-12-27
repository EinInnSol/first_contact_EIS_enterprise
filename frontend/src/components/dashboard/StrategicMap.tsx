"use client";

import React, { useState } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from '@vis.gl/react-google-maps';

interface MarkerData {
    id: string;
    position: { lat: number; lng: number };
    name: string;
    type: 'vendor' | 'gap' | 'incident';
}

const mapId = "einharjer_prime_map";
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const sampleMarkers: MarkerData[] = [
    { id: '1', position: { lat: 33.7701, lng: -118.1937 }, name: 'Pathways LB (HQ)', type: 'vendor' },
    { id: '2', position: { lat: 33.7850, lng: -118.2100 }, name: 'Service Gap: Zone Alpha', type: 'gap' },
    { id: '3', position: { lat: 33.7600, lng: -118.1800 }, name: 'Urban Outreach', type: 'vendor' },
];

export const StrategicMap: React.FC = () => {
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

    // Dark mode map style
    const mapStyle = [
        { elementType: "geometry", stylers: [{ color: "#050a14" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#050a14" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#00f0ff" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#00f0ff" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#1a2a44" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#0a1428" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#455a64" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#001a2e" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#00f0ff" }],
        },
    ];

    return (
        <div className="w-full h-full relative border border-cyan/20 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={{ lat: 33.7701, lng: -118.1937 }}
                    defaultZoom={13}
                    mapId={mapId}
                    styles={mapStyle}
                    disableDefaultUI={true}
                    gestureHandling={'greedy'}
                >
                    {sampleMarkers.map((marker) => (
                        <AdvancedMarker
                            key={marker.id}
                            position={marker.position}
                            onClick={() => setSelectedMarker(marker)}
                        >
                            <Pin
                                background={marker.type === 'vendor' ? '#00F0FF' : '#FF9900'}
                                borderColor={marker.type === 'vendor' ? '#00B8CC' : '#CC7A00'}
                                glyphColor={'#050A14'}
                            />
                        </AdvancedMarker>
                    ))}

                    {selectedMarker && (
                        <InfoWindow
                            position={selectedMarker.position}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div className="p-2 bg-start-900 text-white min-w-[150px]">
                                <div className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-1">
                                    {selectedMarker.type === 'vendor' ? 'Service Provider' : 'Service Alert'}
                                </div>
                                <div className="text-sm font-bold mb-2">{selectedMarker.name}</div>
                                <button className="text-[10px] font-bold bg-cyan/10 border border-cyan/40 px-2 py-1 hover:bg-cyan/30 transition-all uppercase">
                                    View Intelligence
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>

            {/* Map Overlays for that 'Tech' feels */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-start/80 backdrop-blur-md border border-cyan/30 p-3 rounded-sm">
                    <div className="flex items-center gap-2 text-cyan">
                        <div className="w-2 h-2 bg-cyan rounded-full animate-ping" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Live Surveillance Mode</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 font-mono">
                        Scanning 32.74823 / -118.23921
                    </div>
                </div>
            </div>
        </div>
    );
};
