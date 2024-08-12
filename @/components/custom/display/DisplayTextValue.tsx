import Typography, { labelF, sm } from "@/components/typography/Typography";

export default function DisplayTextValue({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex flex-col">
      <Typography fontSize={labelF}>{title}</Typography>
      <Typography fontWeight={400} fontSize={sm}>{value}</Typography>
    </div>
  );
}
