// TypeScript Types for First Contact E.I.S.

export interface User {
  id: string;
  email: string;
  role: 'client' | 'caseworker' | 'vendor_admin' | 'city_admin';
  organization_id: number;
  vendor_id?: number;
}

export interface VendorPerformance {
  vendor_id: number;
  vendor_name: string;
  vendor_slug: string;
  rank: number;
  total_clients: number;
  housed_count: number;
  housing_rate: number;
  avg_days_to_housing: number;
  retention_6mo: number;
  avg_exit_income: number;
  cost_per_outcome: number;
  efficiency_score: number;
}

export interface VendorTerritory {
  vendor_id: number;
  vendor_name: string;
  vendor_slug: string;
  center: { lat: number; lng: number };
  radius: number;
  color: string;
  performance?: {
    cost_per_outcome: number;
    housing_rate: number;
    retention_6mo: number;
    efficiency_score: number;
    rank: number;
  };
}

export interface QRLocation {
  location_id: string;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  vendor_id: number;
  vendor_name: string;
  total_scans: number;
  completed_intakes: number;
  conversion_rate: number;
  qr_code_url?: string;
}

export interface Client {
  id: string;
  case_number: string;
  first_name: string;
  last_name: string;
  assigned_vendor_id: number;
  status: string;
  vi_spdat_score?: number;
  intake_date: string;
}
