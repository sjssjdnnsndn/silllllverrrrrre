import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        quiet: "bg-surface-2 text-muted",
        live: "bg-long/15 text-long",
        long: "bg-long/15 text-long",
        short: "bg-short/15 text-short",
        wait: "bg-caution/15 text-caution",
        accent: "bg-accent/12 text-accent",
      },
    },
    defaultVariants: { tone: "quiet" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
