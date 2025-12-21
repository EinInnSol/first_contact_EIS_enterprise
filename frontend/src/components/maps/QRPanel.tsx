'use client';
import { QRLocation } from '@/types';
import { X, MapPin, QrCode } from 'lucide-react';

export default function QRPanel({ 
  location, 
  onClose 
}: { 
  location: QRLocation;
  onClose: () => void;
}) {
  const conversionColor = location.conversion_rate > 0.7 
    ? 'text-green-600' 
    : location.conversion_rate > 0.5 
    ? 'text-yellow-600' 
    : 'text-red-600';

  return (
    <div className="absolute right-4 top-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b p-4 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
          <MapPin size={20} />
          <h3 className="font-bold">{location.location_name}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded transition">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin size={14} />
          {location.address}
        </p>

        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total Scans" value={location.total_scans} icon="📊" />
            <Stat label="Completed Intakes" value={location.completed_intakes} icon="✅" />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Conversion Rate</p>
          <p className={`text-2xl font-bold ${conversionColor}`}>
            {(location.conversion_rate * 100).toFixed(0)}%
          </p>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs text-gray-500 mb-1">Assigned Vendor</p>
          <p className="font-semibold text-gray-900">{location.vendor_name}</p>
        </div>

        {location.qr_code_url && (
          <div className="border-t pt-3">
            <a 
              href={location.qr_code_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <QrCode size={16} />
              View QR Code
            </a>
          </div>
        )}

        {/* Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
          <p className="text-xs font-semibold text-blue-900 mb-1">Insight</p>
          <p className="text-sm text-blue-800">
            {location.conversion_rate > 0.7 
              ? "Excellent conversion rate. This location is highly effective."
              : location.conversion_rate < 0.5
              ? "Low conversion rate. Consider deploying case manager on-site during peak hours."
              : "Moderate performance. Monitor for improvement opportunities."
            }
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{icon} {value}</p>
    </div>
  );
}
