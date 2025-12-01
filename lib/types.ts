/**
 * Type definitions for MemorieDigitala.ro
 */

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface Event {
  id: number;
  event_id: string;
  access_key: string;
  host_email: string;
  host_name: string;
  host_phone?: string;
  event_name?: string;
  event_date?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_postal?: string;
  delivery_country?: string;
  package_type: string;
  qr_print_enabled: boolean;
  qr_print_quantity: number;
  voice_message_enabled: boolean;
  total_price: number;
  status: 'pending' | 'paid' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface Order {
  id: number;
  stripe_session_id: string;
  event_id: string;
  host_email: string;
  host_name: string;
  base_price: number;
  qr_print_price: number;
  voice_message_price: number;
  total_price: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface MediaUpload {
  id: number;
  event_id: string;
  upload_type: 'photo' | 'video' | 'audio';
  file_url: string;
  file_name: string;
  file_size?: number;
  uploaded_at: string;
  is_approved: boolean;
  guest_ip?: string;
}

export interface CreateOrderRequest {
  hostEmail: string;
  hostName: string;
  phone?: string;
  eventName?: string;
  eventDate?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  qrPrintQuantity: number;
  voiceMessageEnabled: boolean;
  basePrice: number;
  qrPrintPrice: number;
  voiceMessagePrice: number;
  totalPrice: number;
}

export interface UploadMediaRequest {
  file: File;
  accessKey: string;
  type: 'photo' | 'video' | 'audio';
}






