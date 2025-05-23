import { useEffect } from "react";
import { useCustomerStore } from "~/routes/home.customer.$id/customer-store";
import { useSupplierStore } from "~/routes/home.supplier.$id/supplier-store";

export const DocumentRegisters = ({ form }: { form: any }) => {
  const supplierStore = useSupplierStore();
  const customerStore = useCustomerStore();
  

  useEffect(() => {
    if (customerStore.newCustomer) {
      form.setValue("party", {
        id: customerStore.newCustomer.id,
        name: customerStore.newCustomer.name,
      });
    }
  }, [customerStore.newCustomer]);

  useEffect(() => {
    if (supplierStore.newSupplier) {
      form.setValue("party", {
        id: supplierStore.newSupplier.id,
        name: supplierStore.newSupplier.name,
      });
    }
  }, [supplierStore.newSupplier]);
};
