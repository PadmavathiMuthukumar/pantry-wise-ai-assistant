import { useState } from "react";
import Navigation from "@/components/Navigation";
import PantryDashboard from "@/components/PantryDashboard";
import SmartRecommendations from "@/components/SmartRecommendations";
import PriceIntelligence from "@/components/PriceIntelligence";
import ShoppingList from "@/components/ShoppingList";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PantryDashboard />;
      case 'recommendations':
        return <SmartRecommendations />;
      case 'prices':
        return <PriceIntelligence />;
      case 'shopping':
        return <ShoppingList />;
      default:
        return <PantryDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
