import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Trash2, DollarSign, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  isChecked: boolean;
  reason: string;
  daysUntilNeeded?: number;
}

const mockShoppingItems: ShoppingItem[] = [
  {
    id: '1',
    name: 'Moong Dal',
    quantity: 2,
    unit: 'kg',
    estimatedPrice: 150,
    priority: 'high',
    category: 'Pulses',
    isChecked: false,
    reason: 'Running low - needed in 3 days',
    daysUntilNeeded: 3
  },
  {
    id: '2',
    name: 'Basmati Rice',
    quantity: 5,
    unit: 'kg',
    estimatedPrice: 280,
    priority: 'medium',
    category: 'Grains',
    isChecked: false,
    reason: 'Bulk buying recommended',
    daysUntilNeeded: 15
  },
  {
    id: '3',
    name: 'Olive Oil',
    quantity: 1,
    unit: 'L',
    estimatedPrice: 850,
    priority: 'low',
    category: 'Oils',
    isChecked: true,
    reason: 'Good price - save ₹50',
    daysUntilNeeded: 25
  },
  {
    id: '4',
    name: 'Whole Wheat Flour',
    quantity: 5,
    unit: 'kg',
    estimatedPrice: 45,
    priority: 'medium',
    category: 'Grains',
    isChecked: false,
    reason: 'Stock running low',
    daysUntilNeeded: 8
  }
];

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingItems);
  const [newItemName, setNewItemName] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: 1,
      unit: 'kg',
      estimatedPrice: 0,
      priority: 'medium',
      category: 'Other',
      isChecked: false,
      reason: 'Manually added'
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  const filteredItems = showCompleted ? items : items.filter(item => !item.isChecked);
  const totalCost = items.filter(item => !item.isChecked).reduce((sum, item) => sum + item.estimatedPrice, 0);
  const completedCount = items.filter(item => item.isChecked).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

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
              <ShoppingCart className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{completedCount}</p>
              </div>
              <Sparkles className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold text-accent">₹{totalCost}</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping List */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Smart Shopping List
              </CardTitle>
              <CardDescription>
                AI-generated list based on your consumption patterns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Hide' : 'Show'} Completed
              </Button>
              <Button variant="default" size="sm">
                Export List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add New Item */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add new item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              className="flex-1"
            />
            <Button onClick={addItem} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={cn(
                  "transition-all duration-300",
                  item.isChecked && "opacity-60 bg-muted/50"
                )}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      checked={item.isChecked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-1"
                    />

                    {/* Item Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-medium",
                            item.isChecked && "line-through text-muted-foreground"
                          )}>
                            {item.name}
                          </h3>
                          <Badge variant={getPriorityColor(item.priority) as any}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">₹{item.estimatedPrice}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.quantity} {item.unit}</span>
                        <span>{item.reason}</span>
                        {item.daysUntilNeeded && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Need in {item.daysUntilNeeded} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {showCompleted ? 'No items in your list' : 'All items completed!'}
              </p>
            </div>
          )}

          {/* Summary */}
          {items.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {items.filter(item => !item.isChecked).length} items remaining
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
                  <p className="text-xl font-bold">₹{totalCost}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}