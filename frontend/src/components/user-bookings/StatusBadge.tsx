import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { StatusType } from "@/shared/types";
import { getStatusBadgeConfig } from "@/shared/utils";

interface StatusBadgeProps {
  status: StatusType;
}

const iconComponents = {
  AlertCircle,
  X,
  CheckCircle,
  Clock,
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = getStatusBadgeConfig(status);
  const IconComponent =
    iconComponents[config.icon as keyof typeof iconComponents];

  return (
    <Badge
      variant={
        config.variant as
          | "secondary"
          | "default"
          | "destructive"
          | "outline"
          | null
          | undefined
      }
      className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105
        flex items-center gap-2 "
    >
      <IconComponent />
      {config.text}
    </Badge>
  );
}
