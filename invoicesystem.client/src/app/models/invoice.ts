export interface Invoice {
  id: number;
  name: string;
  billingAddress: string;
  email: string;
  isActive: boolean;
  created: string; // DateTime from .NET serialized as ISO string
}
