class Parties {
    customer = "customer"
    supplier = "supplier"
    purchaseInvoice = "purchaseInvoice"
    saleInvoice = "saleInvoice"
    payment = "payment"

    //Regate
    booking = "booking"
    invoicePaties = {
        [this.customer]:this.saleInvoice,
        [this.supplier]:this.purchaseInvoice,
    }

    paymentParties = {
        ...this.invoicePaties,
    }
}

export const parties = new Parties();