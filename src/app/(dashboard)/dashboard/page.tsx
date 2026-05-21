import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Users, BarChart3 } from "lucide-react";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the user's cards to get IDs for analytics
  const cards = await prisma.card.findMany({
    where: { userId },
    select: { id: true }
  });

  const cardIds = cards.map(c => c.id);

  // Fetch metrics
  const totalViews = await prisma.analytics.count({
    where: {
      cardId: { in: cardIds },
      eventType: "PAGE_VIEW"
    }
  });

  const activeCards = cards.length;

  const contactsSaved = await prisma.contact.count({
    where: {
      ownerId: userId
    }
  });

  // Fetch chart data (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  const recentAnalytics = await prisma.analytics.findMany({
    where: {
      cardId: { in: cardIds },
      eventType: "PAGE_VIEW",
      createdAt: { gte: last7Days }
    },
    select: { createdAt: true }
  });

  // Group by day
  const viewsByDay = recentAnalytics.reduce((acc: any, curr) => {
    const date = curr.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Create an array of the last 7 days to ensure empty days are shown
  const chartData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(last7Days);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    chartData.push({
      name: dateStr,
      views: viewsByDay[dateStr] || 0
    });
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your digital business cards and networking performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime profile views
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCards}</div>
            <p className="text-xs text-muted-foreground">
              Out of 2 allowed on Free plan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts Saved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsSaved}</div>
            <p className="text-xs text-muted-foreground">
              New leads captured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Profile Views (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
