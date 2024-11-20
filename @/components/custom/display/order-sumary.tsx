import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { i18n } from "i18next";
import { formatCurrency } from "~/util/format/formatCurrency";

interface OrderSummaryProps {
  orderTotal: number;
  orderTax:number;
  i18n:i18n;
  currency:string
}

export default function OrderSumary({ orderTotal, orderTax,i18n,currency }: OrderSummaryProps) {
  const taxAmount = orderTax;
  const totalWithTax = orderTotal + taxAmount;

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   }).format(amount);
  // };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
          <div className="space-y-4 md:space-y-2">
            <div className="flex justify-between items-center md:flex-col md:items-start">
              <span className="text-sm font-medium text-gray-500 md:mb-1">Order Total:</span>
              <span className="text-lg font-semibold">{formatCurrency(orderTotal,currency,i18n.language)}</span>
            </div>
            <div className="flex justify-between items-center md:flex-col md:items-start">
              {/* <span className="text-sm font-medium text-gray-500 md:mb-1">Tax ({(taxRate * 100).toFixed(2)}%):</span> */}
              <span className="text-lg font-semibold">{formatCurrency(taxAmount,currency,i18n.language)}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 md:pt-0 md:border-t-0 md:border-l md:pl-4">
            <div className="flex justify-between items-center md:flex-col md:items-start">
              <span className="text-base font-medium text-gray-900 md:mb-1">Total (incl. tax):</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(totalWithTax,currency,i18n.language)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}