import { type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  color?: string;
  defaultOpen?: boolean;
  isChildren?: boolean;
  children?: NavItem[];
}

export type OpenModal = (key: string, value: any) => void;
