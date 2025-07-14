import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Target, Calendar, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from "@/lib/utils";

interface PriceData {
  date: string;
  price: number;
  month: string;
}

interface PriceTrend {
  id: string;
  itemName: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  prediction: 'increase' | 'decrease' | 'stable';
  bestTimeToBy: string;
  data: PriceData[];
}

const mockPriceTrends: PriceTrend[] = [
  {
    id: '1',
    itemName: 'Moong Dal',
    currentPrice: 150,
    previousPrice: 160,
    trend: 'down',
    changePercent: -6.25,
    prediction: 'increase',
    bestTimeToBy: 'Now - Before festival season',
    data: [
      { date: '2024-01', price: 140, month: 'Jan' },
      { date: '2024-02', price: 145, month: 'Feb' },
      { date: '2024-03', price: 155, month: 'Mar' },
      { date: '2024-04', price: 165, month: 'Apr' },
      { date: '2024-05', price: 160, month: 'May' },
      { date: '2024-06', price: 150, month: 'Jun' },
    ]
  },
  {
    id: '2',
    itemName: 'Basmati Rice',
    currentPrice: 280,
    previousPrice: 270,
    trend: 'up',
    changePercent: 3.7,
    prediction: 'increase',
    bestTimeToBy: 'Consider bulk buying',
    data: [
      { date: '2024-01', price: 250, month: 'Jan' },
      { date: '2024-02', price: 255, month: 'Feb' },
      { date: '2024-03', price: 260, month: 'Mar' },
      { date: '2024-04', price: 265, month: 'Apr' },
      { date: '2024-05', price: 270, month: 'May' },
      { date: '2024-06', price: 280, month: 'Jun' },
    ]
  },
  {
    id: '3',
    itemName: 'Olive Oil',
    currentPrice: 850,
    previousPrice: 900,
    trend: 'down',
    changePercent: -5.6,
    prediction: 'stable',
    bestTimeToBy: 'Good time to stock up',
    data: [
      { date: '2024-01', price: 920, month: 'Jan' },
      { date: '2024-02', price: 910, month: 'Feb' },
      { date: '2024-03', price: 905, month: 'Mar' },
      { date: '2024-04', price: 900, month: 'Apr' },
      { date: '2024-05', price: 885, month: 'May' },
      { date: '2024-06', price: 850, month: 'Jun' },
    ]
  }
];

export default function PriceIntelligence() {
  const [selectedItem, setSelectedItem] = useState<PriceTrend>(mockPriceTrends[0]);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-destructive';
      case 'down': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPredictionBadge = (prediction: string) => {
    switch (prediction) {
      case 'increase': return <Badge variant="destructive">Expected to rise</Badge>;
      case 'decrease': return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Expected to fall</Badge>;
      default: return <Badge variant="outline">Stable pricing</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-accent border-0 shadow-medium text-accent-foreground">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Price Intelligence</h2>
                <p className="text-sm opacity-90">
                  Track prices and optimize your shopping
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Best Deals</p>
              <p className="text-2xl font-bold">3 Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockPriceTrends.map((item) => (
          <Card 
            key={item.id} 
            className={cn(
              "cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1",
              selectedItem.id === item.id && "ring-2 ring-primary shadow-medium"
            )}
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.itemName}</h3>
                  {getTrendIcon(item.trend)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">₹{item.currentPrice}</span>
                    <span className={cn("text-sm", getTrendColor(item.trend))}>
                      {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Previous: ₹{item.previousPrice}
                  </p>
                </div>

                {getPredictionBadge(item.prediction)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Chart */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {selectedItem.itemName} - Price Trend
              </CardTitle>
              <CardDescription>
                Historical pricing data and predictions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {(['3m', '6m', '1y'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedItem.data}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-medium)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Best Time to Buy</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedItem.bestTimeToBy}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Savings Potential</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Save ₹{Math.abs(selectedItem.currentPrice - selectedItem.previousPrice)} vs last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Price Alert</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedItem.prediction === 'increase' ? 'Consider buying soon' : 'Wait for better prices'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="default" className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
              <Button variant="pantry" className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                Track This Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}