import { Package, Truck, CheckCircle, Clock, CircleDot, XCircle } from "lucide-react";

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

interface OrderStatusTimelineProps {
  status: string;
  compact?: boolean;
}

const OrderStatusTimeline = ({ status, compact = false }: OrderStatusTimelineProps) => {
  const getCurrentStepIndex = () => {
    if (status === "cancelled") return -1;
    return statusSteps.findIndex((step) => step.key === status);
  };

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <XCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = getCurrentStepIndex();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          return (
            <div
              key={step.key}
              className={`w-2 h-2 rounded-full transition-colors ${
                isCompleted ? "bg-primary" : "bg-border"
              }`}
              title={step.label}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{
            width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-muted-foreground"
                  } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                >
                  {isCurrent ? (
                    <CircleDot className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs text-center max-w-[60px] hidden sm:block ${
                    isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
