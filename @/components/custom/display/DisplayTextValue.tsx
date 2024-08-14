import Typography, { labelF, sm } from "@/components/typography/Typography";
import { Link } from "@remix-run/react";

export default function DisplayTextValue({
  title,
  value,
  to,
}: {
  title: string;
  value: string;
  to?: string;
}) {
  return (
    <div className="flex flex-col ">
      <Typography fontSize={labelF}>{title}</Typography>
      {to != undefined ? (
        <Link to={to}  className="underline">
          <Typography
            fontWeight={400}
            fontSize={sm}
            className="bg-accent rounded-md p-1 shadow-sm"
          >
            {value}
          </Typography>
        </Link>
      ) : (
        <Typography
          fontWeight={400}
          fontSize={sm}
          className="bg-accent rounded-md p-1 shadow-sm"
        >
          {value}
        </Typography>
      )}
    </div>
  );
}
