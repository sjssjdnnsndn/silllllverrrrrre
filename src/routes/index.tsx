import { createFileRoute } from "@tanstack/react-router";
import { DeskApp, DeskSkeleton } from "@/components/desk/desk-app";
import { getMarketSnapshot } from "@/lib/market/snapshot";

export const Route = createFileRoute("/")({
  loader: () => getMarketSnapshot(),
  component: Home,
  pendingComponent: DeskSkeleton,
});

function Home() {
  const initial = Route.useLoaderData();
  return <DeskApp initial={initial} />;
}
