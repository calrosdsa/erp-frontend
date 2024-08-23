import Typography, {
  labelF,
  subtitle,
} from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ArrowUpRightIcon } from "lucide-react";
import { NavItem } from "~/types";

export default function DisplayRouteNav({ navItem }: { navItem: NavItem }) {
  return (
    <div className="">
        <Link to={navItem.href}>
        <div className="flex items-center hover:underline">
          <Typography fontSize={labelF}>{navItem.title}</Typography>

          <ArrowUpRightIcon size={16} />
        </div>
        </Link>
    </div>
  );
}
