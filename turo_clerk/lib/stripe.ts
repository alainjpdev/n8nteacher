import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const createPaymentIntent = async (amount: number, currency = 'usd') => {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

export const createCheckoutSession = async ({
  carId,
  userId,
  amount,
  successUrl,
  cancelUrl,
}: {
  carId: string;
  userId: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Car Rental',
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      carId,
      userId,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
};