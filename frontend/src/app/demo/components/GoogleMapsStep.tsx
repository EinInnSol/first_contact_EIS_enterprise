"use client";

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polygon, InfoWindow } from '@react-google-maps/api';
import { MapPin, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { vendorPerformance, qrLocations } from '../data/demoData';

interface GoogleMapsStepProps {
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

export default function GoogleMapsStep({ onNext, onInteraction, interactionsCompleted, requiredInteractions }: GoogleMapsStepProps) {
    const [selectedVendor, setSelectedVendor] = useState<typeof vendorPerformance[0] | null>(null);
    const [showTerritories, setShowTerritories] = useState(true);
    const [showQRLocations, setShowQRLocations] = useState(false);
    const [clickedVendors, setClickedVendors] = useState<Set<number>>(new Set());

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const handleVendorClick = (vendor: typeof vendorPerformance[0]) => {
        setSelectedVendor(vendor);

        if (!clickedVendors.has(vendor.id)) {
            setClickedVendors(new Set([...clickedVendors, vendor.id]));
            onInteraction();
        }
    };

    const canContinue = interactionsCompleted >= requiredInteractions;

    if (!isLoaded) {
        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-muted)]">Loading Google Maps...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tighter">
                    <span className="text-[var(--primary)]">Step 8:</span> Google Maps - Vendor Territories
                </h1>
                <p className="text-lg text-[var(--text-muted)]">
                    Interactive map showing vendor performance and service coverage
                </p>
            </div>

            {/* Instructions */}
            <div className="nexus-card-outlined bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border-[var(--primary)] p-6">
                <h3 className="font-black mb-3 flex items-center gap-2">
                    <MapPin className="text-[var(--primary)]" size={24} />
                    Required Interaction
                </h3>
                <p className="text-sm mb-4">
                    Click on <strong>{requiredInteractions} different vendor markers</strong> to explore their territories and performance data.
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
                <div className="lg:col-span-2 space-y-4">
                    <div className="nexus-card-outlined bg-[var(--surface)] p-4">
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setShowTerritories(!showTerritories)}
                                className={`nexus-button px-4 py-2 text-sm ${showTerritories ? 'nexus-button-primary' : 'bg-[var(--surface-hover)] border border-[var(--border-crisp)]'
                                    }`}
                            >
                                {showTerritories ? '✓' : ''} Territories
                            </button>
                            <button
                                onClick={() => setShowQRLocations(!showQRLocations)}
                                className={`nexus-button px-4 py-2 text-sm ${showQRLocations ? 'nexus-button-primary' : 'bg-[var(--surface-hover)] border border-[var(--border-crisp)]'
                                    }`}
                            >
                                {showQRLocations ? '✓' : ''} QR Locations
                            </button>
                        </div>

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
                            {/* Vendor Territories */}
                            {showTerritories && vendorPerformance.map((vendor) => (
                                <Polygon
                                    key={`territory-${vendor.id}`}
                                    paths={vendor.territory}
                                    options={{
                                        fillColor: vendor.color,
                                        fillOpacity: 0.15,
                                        strokeColor: vendor.color,
                                        strokeWeight: 2,
                                        strokeOpacity: 0.8
                                    }}
                                />
                            ))}

                            {/* Vendor Markers */}
                            {vendorPerformance.map((vendor) => (
                                <Marker
                                    key={`marker-${vendor.id}`}
                                    position={vendor.location}
                                    onClick={() => handleVendorClick(vendor)}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: clickedVendors.has(vendor.id) ? 12 : 10,
                                        fillColor: vendor.color,
                                        fillOpacity: 1,
                                        strokeColor: '#FFFFFF',
                                        strokeWeight: 2,
                                    }}
                                />
                            ))}

                            {/* QR Location Markers */}
                            {showQRLocations && qrLocations.map((location) => (
                                <Marker
                                    key={`qr-${location.id}`}
                                    position={location.location}
                                    icon={{
                                        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMzOUZGMTQiLz48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTQiIHk9IjQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDAiLz48cmVjdCB4PSI0IiB5PSIxNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==',
                                        scaledSize: new window.google.maps.Size(24, 24)
                                    }}
                                />
                            ))}

                            {/* Info Window */}
                            {selectedVendor && (
                                <InfoWindow
                                    position={selectedVendor.location}
                                    onCloseClick={() => setSelectedVendor(null)}
                                >
                                    <div className="p-2 min-w-[250px]">
                                        <h3 className="font-black text-lg mb-2">{selectedVendor.name}</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Territory:</span>
                                                <span className="font-bold">{selectedVendor.territoryName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Score:</span>
                                                <span className="font-bold" style={{ color: selectedVendor.color }}>
                                                    {selectedVendor.score}/100
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Housing Rate:</span>
                                                <span className="font-bold">{(selectedVendor.housingRate * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Cost/Outcome:</span>
                                                <span className="font-bold">${(selectedVendor.costPerOutcome / 1000).toFixed(0)}K</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Trend:</span>
                                                <span className={`font-bold flex items-center gap-1 ${selectedVendor.trend > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {selectedVendor.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                    {selectedVendor.trend > 0 ? '+' : ''}{selectedVendor.trend}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Vendor List */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">Vendors</h3>
                        <div className="space-y-3">
                            {vendorPerformance.map((vendor) => (
                                <button
                                    key={vendor.id}
                                    onClick={() => handleVendorClick(vendor)}
                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${clickedVendors.has(vendor.id)
                                            ? 'border-[var(--success)] bg-[var(--success)]/5'
                                            : 'border-[var(--border-crisp)] hover:border-[var(--primary)]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold">{vendor.name}</span>
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: vendor.color }}
                                        />
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {vendor.territoryName}
                                    </div>
                                    <div className="text-sm font-bold mt-1" style={{ color: vendor.color }}>
                                        Score: {vendor.score}/100
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* What This Shows */}
                    <div className="nexus-card-outlined bg-[var(--surface)] p-6 space-y-4">
                        <h3 className="text-xl font-black">What This Shows</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Geographic service coverage by vendor</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Users size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Performance metrics overlaid on territories</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <DollarSign size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Cost-effectiveness by geographic area</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <TrendingUp size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                                <span>Service gaps and underserved areas</span>
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
                            ? 'Continue to Layer 8 Reveal →'
                            : `Click ${requiredInteractions - interactionsCompleted} more vendors`
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
