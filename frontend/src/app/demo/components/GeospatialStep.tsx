"use client";

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer, Marker } from '@react-google-maps/api';
import { Map, Layers, Check } from 'lucide-react';
import { heatmapData, qrLocations } from '../data/demoData';

interface GeospatialStepProps {
    onNext: () => void;
    onInteraction: () => void;
    interactionsCompleted: number;
    requiredInteractions: number;
}

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px'
};

const center = {
    lat: 33.7701,
    lng: -118.1937
};

const heatmapLayers = [
    { id: 'placements', name: 'Housing Placements', description: 'Where clients are successfully housed' },
    { id: 'qrScans', name: 'QR Code Scans', description: 'Intake activity hotspots' },
    { id: 'serviceGaps', name: 'Service Gaps', description: 'Underserved areas needing attention' }
];

export default function GeospatialStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: GeospatialStepProps) {
    const [activeLayer, setActiveLayer] = useState<string | null>(null);
    const [toggledLayers, setToggledLayers] = useState<Set<string>>(new Set());

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['visualization']
    });

    const handleToggleLayer = (layerId: string) => {
        setActiveLayer(layerId);
        if (!toggledLayers.has(layerId)) {
            setToggledLayers(new Set([...toggledLayers, layerId]));
            onInteraction();
        }
    };

    const canContinue = interactionsCompleted >= requiredInteractions;

    const getHeatmapPoints = (layerId: string) => {
        const data = heatmapData[layerId as keyof typeof heatmapData] || [];
        return data.map(point => ({
            location: new google.maps.LatLng(point.location.lat, point.location.lng),
            weight: point.weight
        }));
    };

    if (!isLoaded) {
        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-muted)]">Loading Maps...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Step 12:</span> Geospatial Intelligence & Heat Maps
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    Visual analysis of service patterns and gaps
                </p>
            </div>

            {/* Instructions */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6">
                <h3 className="font-black mb-3 flex items-center gap-2">
                    <Layers className="text-[var(--primary)]" size={24} />
                    Required Interaction
                </h3>
                <p className="text-sm mb-4">
                    Toggle <strong>{requiredInteractions} different heat map layers</strong> to explore service patterns across Long Beach.
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--primary)] transition-all duration-300"
                            style={{ width: `${(interactionsCompleted / requiredInteractions) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold">
                        {interactionsCompleted}/{requiredInteractions}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2 nexus-card-outlined bg-[var(--surface)] p-4">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={12}
                        options={{
                            styles: [
                                {
                                    featureType: 'poi',
                                    elementType: 'labels',
                                    stylers: [{ visibility: 'off' }]
                                }
                            ]
                        }}
                    >
                        {/* Heat Map Layer */}
                        {activeLayer && (
                            <HeatmapLayer
                                data={getHeatmapPoints(activeLayer)}
                                options={{
                                    radius: 30,
                                    opacity: 0.7,
                                    gradient: activeLayer === 'serviceGaps'
                                        ? ['rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)', 'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)', 'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)', 'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)']
                                        : undefined
                                }}
                            />
                        )}

                        {/* QR Location Markers */}
                        {qrLocations.map((location) => (
                            <Marker
                                key={`qr-${location.id}`}
                                position={location.location}
                                title={location.name}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 8,
                                    fillColor: '#39FF14',
                                    fillOpacity: 0.8,
                                    strokeColor: '#FFFFFF',
                                    strokeWeight: 2,
                                }}
                            />
                        ))}
                    </GoogleMap>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Layer Controls */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">Heat Map Layers</h3>
                        <div className="space-y-3">
                            {heatmapLayers.map((layer) => {
                                const isToggled = toggledLayers.has(layer.id);
                                const isActive = activeLayer === layer.id;

                                return (
                                    <button
                                        key={layer.id}
                                        onClick={() => handleToggleLayer(layer.id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isActive ? 'border-[var(--primary)] bg-[var(--primary)]/10' :
                                                isToggled ? 'border-[var(--success)] bg-[var(--success)]/5' :
                                                    'border-[var(--border-crisp)] hover:border-[var(--primary)]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold">{layer.name}</span>
                                            {isToggled && (
                                                <Check size={20} className="text-[var(--success)]" />
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {layer.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Insights */}
                    {activeLayer && (
                        <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4 animate-in fade-in duration-300">
                            <h3 className="text-xl font-black">Insights</h3>
                            {activeLayer === 'placements' && (
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>North Long Beach has highest placement success (73%)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Clustering near PATH facilities indicates effective service delivery</span>
                                    </li>
                                </ul>
                            )}
                            {activeLayer === 'qrScans' && (
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Beach Shelter has highest intake activity (203 scans)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Downtown Library shows low conversion (15%)</span>
                                    </li>
                                </ul>
                            )}
                            {activeLayer === 'serviceGaps' && (
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>West Long Beach critically underserved</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-[var(--success)] mt-0.5 flex-shrink-0" />
                                        <span>Recommend new QR location at Bixby Park</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}

                    {/* What This Shows */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">Geospatial Intelligence</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Map size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Visualize service patterns geographically</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Map size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Identify underserved areas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Map size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Optimize resource placement</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Map size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Data-driven expansion planning</span>
                            </li>
                        </ul>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={onNext}
                        disabled={!canContinue}
                        className={`w-full nexus-button py-4 ${canContinue
                                ? 'nexus-button-primary'
                                : 'opacity-50 cursor-not-allowed bg-[var(--surface-hover)] border border-[var(--border-crisp)]'
                            }`}
                    >
                        {canContinue
                            ? 'Continue to Business Model →'
                            : `Toggle ${requiredInteractions - interactionsCompleted} more layers`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
