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
    <div className="absolute right-4 top-4 bottom-4 w-96 bg-white rounded-lg shadow-xl overflow-y-auto border border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
        <h2 className="text-xl font-bold text-gray-900">{vendor.vendor_name} {rankEmoji}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition">
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {perf ? (
          <>
            <MetricCard 
              label="Overall Rank" 
              value={`#${perf.rank}`}
              color={perf.rank <= 2 ? 'text-green-600' : 'text-gray-900'}
            />
            <MetricCard 
              label="Cost Per Outcome" 
              value={`$${perf.cost_per_outcome.toLocaleString()}`}
              color={perf.cost_per_outcome < 30000 ? 'text-green-600' : perf.cost_per_outcome < 50000 ? 'text-yellow-600' : 'text-red-600'}
            />
            <MetricCard 
              label="Housing Rate" 
              value={`${(perf.housing_rate * 100).toFixed(0)}%`}
              color={perf.housing_rate > 0.7 ? 'text-green-600' : perf.housing_rate > 0.5 ? 'text-yellow-600' : 'text-red-600'}
            />
            <MetricCard 
              label="6-Month Retention" 
              value={`${(perf.retention_6mo * 100).toFixed(0)}%`}
              color={perf.retention_6mo > 0.75 ? 'text-green-600' : perf.retention_6mo > 0.6 ? 'text-yellow-600' : 'text-red-600'}
            />
            <MetricCard 
              label="Efficiency Score" 
              value={`${perf.efficiency_score}/100`}
              color={perf.efficiency_score >= 75 ? 'text-green-600' : perf.efficiency_score >= 50 ? 'text-yellow-600' : 'text-red-600'}
            />

            {/* AI Insights Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">AI Insights</h3>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-900">
                  {perf.rank === 1 
                    ? `Top performer. Consider expanding ${vendor.vendor_name}'s capacity to maximize ROI.`
                    : perf.cost_per_outcome > 60000
                    ? `At $${perf.cost_per_outcome.toLocaleString()}, this vendor is 2-3x more expensive than top performers. Contract review recommended.`
                    : `Moderate performance. Opportunities for improvement in ${perf.housing_rate < 0.6 ? 'housing placement rate' : 'retention strategies'}.`
                  }
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm">No performance data available for this vendor.</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
