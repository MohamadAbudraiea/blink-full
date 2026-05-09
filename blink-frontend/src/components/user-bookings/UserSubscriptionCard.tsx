import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { Subscription } from "@/shared/types";
import { CalendarDays, Banknote, MapPin } from "lucide-react";
import BookingCard from "./BookingCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function UserSubscriptionCard({ subscription }: { subscription: Subscription }) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finished": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "canceled": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "requested": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "pending": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card className="w-full overflow-hidden border-2 transition-all hover:shadow-lg">
      <CardHeader className="bg-muted/50 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Plan {subscription.plan_type} Tickets</span>
            <Badge variant="outline" className={getStatusColor(subscription.status)}>
              {t(`status.${subscription.status}`, { defaultValue: subscription.status })}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground font-mono">#{subscription.id}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{format(new Date(subscription.created_at), "PPP")}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Banknote className="h-4 w-4 text-primary" />
            <span>Price: {subscription.total_price ? `${subscription.total_price}` : "-"}</span>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tickets" className="border-none">
            <AccordionTrigger className="bg-muted/30 px-3 rounded-md hover:bg-muted/50 transition-colors">
              View Included Tickets ({subscription.tickets?.length || 0})
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {subscription.tickets?.map((ticket, index) => (
                <div key={ticket.id} className="pl-4 border-l-2 border-primary/20">
                  <h4 className="text-sm font-semibold mb-2">Ticket #{index + 1}</h4>
                  <BookingCard booking={ticket} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
