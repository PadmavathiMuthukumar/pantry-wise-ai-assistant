import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: Date;
  estimatedDuration: number; // days
  currentPrice: number;
  lastPrice: number;
  daysLeft: number;
  status: 'healthy' | 'warning' | 'critical';
}

const mockPantryItems: PantryItem[] = [
  {
    id: '1',
    name: 'Moong Dal',
    category: 'Pulses',
    quantity: 2,
    unit: 'kg',
    purchaseDate: new Date('2024-06-01'),
    estimatedDuration: 30,
    currentPrice: 150,
    lastPrice: 160,
    daysLeft: 3,
    status: 'critical'
  },
  {
    id: '2',
    name: 'Basmati Rice',
    category: 'Grains',
    quantity: 5,
    unit: 'kg',
    purchaseDate: new Date('2024-06-15'),
    estimatedDuration: 45,
    currentPrice: 280,
    lastPrice: 270,
    daysLeft: 15,
    status: 'warning'
  },
  {
    id: '3',
    name: 'Olive Oil',
    category: 'Oils',
    quantity: 1,
    unit: 'L',
    purchaseDate: new Date('2024-05-20'),
    estimatedDuration: 60,
    currentPrice: 850,
    lastPrice: 900,
    daysLeft: 25,
    status: 'healthy'
  },
  {
    id: '4',
    name: 'Whole Wheat Flour',
    category: 'Grains',
    quantity: 10,
    unit: 'kg',
    purchaseDate: new Date('2024-06-10'),
    estimatedDuration: 35,
    currentPrice: 45,
    lastPrice: 42,
    daysLeft: 8,
    status: 'warning'
  }
];

export default function PantryDashboard() {
  const [items, setItems] = useState<PantryItem[]>(mockPantryItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'healthy': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <TrendingDown className="h-4 w-4" />;
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getProgressValue = (daysLeft: number, totalDuration: number) => {
    return Math.max(0, (daysLeft / totalDuration) * 100);
  };

  const criticalItems = items.filter(item => item.status === 'critical').length;
  const warningItems = items.filter(item => item.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-medium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold text-warning">{warningItems}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Items</p>
                <p className="text-2xl font-bold text-destructive">{criticalItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Pantry Items
          </CardTitle>
          <CardDescription>
            Track consumption and get smart refill recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'warning' ? 'secondary' : 'outline'}>
                        {item.category}
                      </Badge>
                    </div>

                    {/* Quantity and Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit}
                      </span>
                      <div className={cn("flex items-center gap-1 text-sm", getStatusColor(item.status))}>
                        {getStatusIcon(item.status)}
                        <span>{item.daysLeft} days left</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Progress 
                        value={getProgressValue(item.daysLeft, item.estimatedDuration)} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Purchased: {item.purchaseDate.toLocaleDateString()}</span>
                        <span>{Math.round(getProgressValue(item.daysLeft, item.estimatedDuration))}% left</span>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">₹{item.currentPrice}</span>
                        {item.currentPrice < item.lastPrice ? (
                          <TrendingDown className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.currentPrice < item.lastPrice ? 'Save' : 'Increase'} ₹{Math.abs(item.currentPrice - item.lastPrice)}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={item.status === 'critical' ? 'warning' : 'pantry'}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.status === 'critical' ? 'Reorder Now' : 'Add to List'}
                    </Button>
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