import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Recommendation {
  id: string;
  item_name: string;
  type: 'refill' | 'bulk_buy' | 'alternative' | 'seasonal';
  reason: string;
  priority: 'low' | 'medium' | 'high';
  savings: number;
  current_price?: number;
  suggested_price?: number;
  confidence: number;
  created_at: string;
  updated_at: string;
}

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations((data || []) as Recommendation[]);
    } catch (error: any) {
      toast({
        title: "Error fetching recommendations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addRecommendation = async (recommendation: Omit<Recommendation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .insert([{ ...recommendation, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      setRecommendations(prev => [data as Recommendation, ...prev]);
      
      toast({
        title: "Recommendation added",
        description: `${recommendation.item_name} recommendation has been added.`
      });
    } catch (error: any) {
      toast({
        title: "Error adding recommendation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      
      toast({
        title: "Recommendation removed",
        description: "Recommendation has been removed."
      });
    } catch (error: any) {
      toast({
        title: "Error removing recommendation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    loading,
    addRecommendation,
    deleteRecommendation,
    refetch: fetchRecommendations
  };
};