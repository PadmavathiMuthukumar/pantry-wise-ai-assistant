import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimated_price?: number;
  priority: 'low' | 'medium' | 'high';
  is_checked: boolean;
  category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []) as ShoppingItem[]);
    } catch (error: any) {
      toast({
        title: "Error fetching shopping list",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<ShoppingItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('shopping_list')
        .insert([{ ...item, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [data as ShoppingItem, ...prev]);
      
      toast({
        title: "Item added",
        description: `${item.name} has been added to your shopping list.`
      });
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateItem = async (id: string, updates: Partial<ShoppingItem>) => {
    try {
      const { data, error } = await supabase
        .from('shopping_list')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data as ShoppingItem : item));
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your shopping list."
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      await updateItem(id, { is_checked: !item.is_checked });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
    refetch: fetchItems
  };
};