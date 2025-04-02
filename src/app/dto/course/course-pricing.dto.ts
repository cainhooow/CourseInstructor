export type CoursePricingDTO = {
  id: string;
  courseId: string;
  full_price: string;
  upfront_price: string;
  currency: string;
  active: boolean;

  created_at: Date;
  updated_at: Date;
};
