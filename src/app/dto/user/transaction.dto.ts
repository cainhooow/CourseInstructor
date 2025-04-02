export type TransactionDTO = {
  id: string;
  paymentMethodId: string;
  coursePricingId: string;
  userId: string;
  discountCouponId?: string;
  courseCouponId?: string;

  paymentStatus?: string;
  externalTransactionId?: string;

  created_at: Date;
  updated_at: Date;
};
