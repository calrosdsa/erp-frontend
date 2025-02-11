import { useActionsFieldArray } from "~/util/hooks/use-actions-field-array";
import { DataTable } from "../../table/CustomTable";
import { Control } from "react-hook-form";
import { paymentTermsLineColumns } from "../../table/columns/document/payment-terms.columns";

export default function PaymentTermLines({
  control,
  formValues,
  allowEdit,
}: {
  control: Control<any, any>;
  formValues: any;
  allowEdit: boolean;
}) {
  const [arrayFields, metaOptions] = useActionsFieldArray({
    control: control,
    name: "payment_term_lines",
  });
  //   const [entityFetcher, onEntityChange] = useSearchEntity({
  //     loadModules: false,
  //   });
  const { update } = arrayFields;

  const updateCell = (row: number, column: string, value: string) => {
    let section = formValues.payment_term_lines[row] as any;
    if (section) {
      section[column as keyof any] = value;
      // form.setValue(`payment_term_lines.${row}`,section)
      update(row, section);
    }
  };
  return (
    <>
      <DataTable
        data={formValues.payment_term_lines}
        columns={paymentTermsLineColumns({
          allowEdit,
        })}
        metaOptions={{
          meta: {
            ...metaOptions,
            ...(allowEdit && {
              updateCell: updateCell,
            }),
          },
        }}
      />
    </>
  );
}
