export interface Transaction {
  userId: string;
  amount: number; // in VND
  planId: 'pro_monthly' | 'enterprise_monthly';
  status: 'pending' | 'completed' | 'failed';
  paymentCode: string;
  createdAt: FirebaseFirestore.Timestamp;
}