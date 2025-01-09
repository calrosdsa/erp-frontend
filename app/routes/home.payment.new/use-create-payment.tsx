import { z } from "zod";
import { create } from "zustand";
import { paymentReferceSchema } from "~/util/data/schemas/accounting/payment-schema";
import { formatAmount } from "~/util/format/formatCurrency";

// Define the PaymentReference type based on the Zod schema
type PaymentReference = z.infer<typeof paymentReferceSchema>;

// Define the Payload interface with more specific types
interface Payload {
  amount: number;
  partyType?: string;
  partyName?: string;
  partyID?: number;
  paymentType?: string;
  partyUuid?: string;
  partyReference?: number;
  projectID?: number | null;
  project?: string | null;
  costCenterID?: number | null;
  costCenter?: string | null;
  paymentReferences: PaymentReference[];
}

// Define the store interface
interface CreatePaymentStore {
  payload: Payload | null;
  setData: (payload: Payload) => void;
}

// Helper function to format payment reference amounts
const formatPaymentReference = (
  reference: PaymentReference
): PaymentReference => ({
  ...reference,
  allocated: formatAmount(reference.allocated),
  outstanding: formatAmount(reference.outstanding),
  grandTotal: formatAmount(reference.grandTotal),
});

// Create the Zustand store
export const useCreatePayment = create<CreatePaymentStore>((set) => ({
  payload: null,
  setData: (newPayload) => {
    set((state) => ({
      payload: {
        ...newPayload,
        paymentReferences: newPayload.paymentReferences.map(
          formatPaymentReference
        ),
      },
    }));
  },
}));
