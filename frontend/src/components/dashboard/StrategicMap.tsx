"use client";

import React, { useState, useEffect } from 'react';
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
    performance?: {
        housing_rate: number;
        cost_per_outcome: number;
        efficiency_score: number;
    };
}

const mapId = "einharjer_prime_map";
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const StrategicMap: React.FC = () => {
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<'housing_rate' | 'cost_per_outcome' | 'efficiency_score'>('housing_rate');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch vendor territories from backend
        const fetchVendorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maps/vendor-territories?include_performance=true`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const vendorMarkers = data.territories.map((territory: any) => ({
                        id: territory.vendor_id.toString(),
                        position: {
                            lat: territory.center_lat || 33.7701,
                            lng: territory.center_lng || -118.1937
                        },
                        name: territory.vendor_name,
                        type: 'vendor' as const,
                        performance: territory.performance
                    }));
                    setMarkers(vendorMarkers);
                } else {
                    // Fallback to sample data if API fails
                    setMarkers([
                        { id: '1', position: { lat: 33.7701, lng: -118.1937 }, name: 'Pathways LB (HQ)', type: 'vendor' },
                        { id: '2', position: { lat: 33.7850, lng: -118.2100 }, name: 'Service Gap: Zone Alpha', type: 'gap' },
                        { id: '3', position: { lat: 33.7600, lng: -118.1800 }, name: 'Urban Outreach', type: 'vendor' },
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch vendor data:', error);
                // Fallback to sample data
                setMarkers([
                    { id: '1', position: { lat: 33.7701, lng: -118.1937 }, name: 'Pathways LB (HQ)', type: 'vendor' },
                    { id: '2', position: { lat: 33.7850, lng: -118.2100 }, name: 'Service Gap: Zone Alpha', type: 'gap' },
                    { id: '3', position: { lat: 33.7600, lng: -118.1800 }, name: 'Urban Outreach', type: 'vendor' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorData();
    }, []);

    // Get marker color based on selected metric
    const getMarkerColor = (marker: MarkerData): string => {
        if (!marker.performance || marker.type !== 'vendor') return '#00F0FF';

        const perf = marker.performance;
        let value = 0;

        switch (selectedMetric) {
            case 'housing_rate':
                value = perf.housing_rate;
                return value >= 0.70 ? '#10B981' : value >= 0.50 ? '#F59E0B' : '#EF4444';
            case 'cost_per_outcome':
                value = perf.cost_per_outcome;
                return value <= 25000 ? '#10B981' : value <= 50000 ? '#F59E0B' : '#EF4444';
            case 'efficiency_score':
                value = perf.efficiency_score;
                return value >= 75 ? '#10B981' : value >= 50 ? '#F59E0B' : '#EF4444';
            default:
                return '#00F0FF';
        }
    };

    const getMetricLabel = (): string => {
        switch (selectedMetric) {
            case 'housing_rate': return 'Housing Rate';
            case 'cost_per_outcome': return 'Cost per Outcome';
            case 'efficiency_score': return 'Efficiency Score';
        }
    };

    const getMetricValue = (marker: MarkerData): string => {
        if (!marker.performance) return 'N/A';
        const perf = marker.performance;

        switch (selectedMetric) {
            case 'housing_rate':
                return `${(perf.housing_rate * 100).toFixed(1)}%`;
            case 'cost_per_outcome':
                return `$${(perf.cost_per_outcome / 1000).toFixed(0)}K`;
            case 'efficiency_score':
                return `${perf.efficiency_score.toFixed(0)}/100`;
        }
    };

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
                    {markers.map((marker) => (
                        <AdvancedMarker
                            key={marker.id}
                            position={marker.position}
                            onClick={() => setSelectedMarker(marker)}
                        >
                            <Pin
                                background={getMarkerColor(marker)}
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
                            <div className="p-2 bg-start-900 text-white min-w-[200px]">
                                <div className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-1">
                                    {selectedMarker.type === 'vendor' ? 'Service Provider' : 'Service Alert'}
                                </div>
                                <div className="text-sm font-bold mb-2">{selectedMarker.name}</div>

                                {selectedMarker.performance && (
                                    <div className="space-y-1 mb-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Housing Rate:</span>
                                            <span className="font-bold text-cyan">
                                                {(selectedMarker.performance.housing_rate * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Efficiency:</span>
                                            <span className="font-bold text-cyan">
                                                {selectedMarker.performance.efficiency_score.toFixed(0)}/100
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button className="text-[10px] font-bold bg-cyan/10 border border-cyan/40 px-2 py-1 hover:bg-cyan/30 transition-all uppercase w-full">
                                    View Intelligence
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>

            {/* Stat Overlay Controls */}
            <div className="absolute top-4 left-4 z-10">
                <div className="bg-start/90 backdrop-blur-md border border-cyan/30 p-3 rounded-sm pointer-events-auto">
                    <div className="text-[10px] font-bold text-cyan uppercase tracking-widest mb-2">Map Overlay</div>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSelectedMetric('housing_rate')}
                            className={`w-full text-left px-2 py-1 text-[10px] rounded transition-all ${selectedMetric === 'housing_rate'
                                ? 'bg-cyan/20 text-cyan font-bold'
                                : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            Housing Rate
                        </button>
                        <button
                            onClick={() => setSelectedMetric('cost_per_outcome')}
                            className={`w-full text-left px-2 py-1 text-[10px] rounded transition-all ${selectedMetric === 'cost_per_outcome'
                                ? 'bg-cyan/20 text-cyan font-bold'
                                : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            Cost per Outcome
                        </button>
                        <button
                            onClick={() => setSelectedMetric('efficiency_score')}
                            className={`w-full text-left px-2 py-1 text-[10px] rounded transition-all ${selectedMetric === 'efficiency_score'
                                ? 'bg-cyan/20 text-cyan font-bold'
                                : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            Efficiency Score
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Legend</div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                                <span className="text-[9px] text-slate-400">Excellent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                                <span className="text-[9px] text-slate-400">Moderate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                                <span className="text-[9px] text-slate-400">Poor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Status Indicator */}
            <div className="absolute top-4 right-4 pointer-events-none">
                <div className="bg-start/80 backdrop-blur-md border border-cyan/30 p-3 rounded-sm">
                    <div className="flex items-center gap-2 text-cyan">
                        <div className="w-2 h-2 bg-cyan rounded-full animate-ping" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Live: {getMetricLabel()}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 font-mono">
                        {markers.filter(m => m.type === 'vendor').length} Vendors Tracked
                    </div>
                </div>
            </div>
        </div>
    );
};
