// app/page.tsx
import Header from '@/components/Header';
import NavigationBar from '@/components/Navigation';
import MainContent from '@/components/MainContent';
import RightSidebar from '@/components/RightSidebar';

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <NavigationBar />
      
      {/* Overall Layout Structure */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <MainContent />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}