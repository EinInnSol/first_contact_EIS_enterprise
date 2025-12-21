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
      <h3 className="font-semibold mb-3 text-gray-900">Map Layers</h3>
      {AVAILABLE_LAYERS.map(layer => (
        <label key={layer.id} className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={activeLayers.has(layer.id)}
            onChange={() => onToggle(layer.id)}
            className="rounded border-gray-300"
          />
          <span>{layer.icon}</span>
          <span className="text-sm text-gray-700">{layer.label}</span>
        </label>
      ))}

      {/* Performance Legend */}
      {activeLayers.has('performance_overlay') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold mb-2 text-gray-900">Performance</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }} />
            <span className="text-xs text-gray-600">Excellent (75+)</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-xs text-gray-600">Good (50-74)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-xs text-gray-600">Needs Improvement</span>
          </div>
        </div>
      )}
    </div>
  );
}
