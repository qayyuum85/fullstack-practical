export interface ReceivedPayment{
  orderId: string,
  status: PaymentStatus
}

export enum PaymentStatus {
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED'
}
