import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingDown, TrendingUp, ShoppingCart, Calendar, DollarSign, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  itemName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  savings: number;
  daysUntilNeeded: number;
  currentPrice: number;
  lastPrice: number;
  confidence: number;
  type: 'refill' | 'bulk_buy' | 'alternative' | 'seasonal';
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    itemName: 'Moong Dal (2kg)',
    reason: 'Running low - typically runs out after 30 days',
    priority: 'high',
    savings: 10,
    daysUntilNeeded: 3,
    currentPrice: 150,
    lastPrice: 160,
    confidence: 95,
    type: 'refill'
  },
  {
    id: '2',
    itemName: 'Basmati Rice (10kg)',
    reason: 'Bulk purchase saves ₹50, price trending up',
    priority: 'medium',
    savings: 50,
    daysUntilNeeded: 15,
    currentPrice: 520,
    lastPrice: 480,
    confidence: 78,
    type: 'bulk_buy'
  },
  {
    id: '3',
    itemName: 'Organic Moong Dal (2kg)',
    reason: 'Better quality alternative, similar price',
    priority: 'low',
    savings: 5,
    daysUntilNeeded: 3,
    currentPrice: 155,
    lastPrice: 160,
    confidence: 68,
    type: 'alternative'
  },
  {
    id: '4',
    itemName: 'Mustard Oil (1L)',
    reason: 'Winter season demand increasing, buy before price rise',
    priority: 'medium',
    savings: 25,
    daysUntilNeeded: 20,
    currentPrice: 180,
    lastPrice: 155,
    confidence: 82,
    type: 'seasonal'
  }
];

export default function SmartRecommendations() {
  const [recommendations] = useState<Recommendation[]>(mockRecommendations);
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['all', 'refill', 'bulk_buy', 'alternative', 'seasonal'];
  const typeLabels = {
    all: 'All',
    refill: 'Refill Alert',
    bulk_buy: 'Bulk Savings',
    alternative: 'Better Options',
    seasonal: 'Seasonal Deals'
  };

  const filteredRecommendations = selectedType === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedType);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'refill': return <Calendar className="h-4 w-4" />;
      case 'bulk_buy': return <DollarSign className="h-4 w-4" />;
      case 'alternative': return <Sparkles className="h-4 w-4" />;
      case 'seasonal': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const totalSavings = recommendations.reduce((sum, rec) => sum + rec.savings, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-secondary border-0 shadow-medium">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Recommendations</h2>
                <p className="text-sm text-muted-foreground">
                  Potential savings: ₹{totalSavings} this month
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {recommendations.length} suggestions
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Type Filter */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Smart Suggestions</CardTitle>
          <CardDescription>
            AI-powered recommendations based on your consumption patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="gap-2"
              >
                {getTypeIcon(type)}
                {typeLabels[type as keyof typeof typeLabels]}
              </Button>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-medium transition-all duration-300 border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{rec.itemName}</h3>
                          <Badge variant={getPriorityColor(rec.priority) as any}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(rec.type)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {rec.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-secondary/50 rounded-lg p-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Days Until Needed</p>
                        <p className="font-semibold text-sm">{rec.daysUntilNeeded}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Current Price</p>
                        <p className="font-semibold text-sm">₹{rec.currentPrice}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Savings</p>
                        <div className="flex items-center justify-center gap-1">
                          <TrendingDown className="h-3 w-3 text-success" />
                          <p className="font-semibold text-sm text-success">₹{rec.savings}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">AI Confidence</p>
                        <p className="font-semibold text-sm">{rec.confidence}%</p>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-3 border border-success/20">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Last month: ₹{rec.lastPrice}</span>
                        <span className="text-sm">→</span>
                        <span className="text-sm font-semibold">Now: ₹{rec.currentPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 text-success">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm font-medium">Save ₹{rec.savings}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline">
                        Set Reminder
                      </Button>
                      <Button size="sm" variant="ghost">
                        Not Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}