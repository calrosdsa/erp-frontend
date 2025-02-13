import { create } from "zustand";
import { AccountLedgerData } from "~/util/data/schemas/accounting/account-ledger.schema";

interface AccountLedgerStore {
  payload: Partial<AccountLedgerData>;
  setPayload: (e: Partial<AccountLedgerData>) => void;
}

export const useAccounLedgerStore = create<AccountLedgerStore>((set) => ({
  payload: {},
  setPayload: (e) =>
    set({
      payload: e,
    }),
}));
