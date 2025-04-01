import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { 
  Star, 
  CheckCircle, 
  Zap, 
  Sun, 
  Users, 
  Clock 
} from 'lucide-react';

const achievementIcons: Record<string, any> = {
  'star': Star,
  'check-circle': CheckCircle,
  'zap': Zap,
  'sun': Sun,
  'users': Users,
  'clock': Clock
};

export function Achievements() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['/api/achievements'],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <a href="#" className="text-primary hover:text-indigo-700 text-sm font-medium">
            View All
          </a>
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Achievements</h3>
        <a href="#" className="text-primary hover:text-indigo-700 text-sm font-medium">
          View All
        </a>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {achievements?.map((achievement: any) => {
          const Icon = achievementIcons[achievement.icon] || Star;
          const isUnlocked = achievement.unlocked;
          
          let bgColorClass = 'bg-gray-100';
          let textColorClass = 'text-gray-400';
          
          if (isUnlocked) {
            switch (achievement.icon) {
              case 'star':
                bgColorClass = 'bg-amber-100';
                textColorClass = 'text-amber-500';
                break;
              case 'check-circle':
                bgColorClass = 'bg-green-100';
                textColorClass = 'text-green-500';
                break;
              case 'zap':
                bgColorClass = 'bg-orange-100';
                textColorClass = 'text-orange-500';
                break;
              case 'sun':
                bgColorClass = 'bg-blue-100';
                textColorClass = 'text-blue-500';
                break;
              case 'users':
                bgColorClass = 'bg-purple-100';
                textColorClass = 'text-purple-500';
                break;
              case 'clock':
                bgColorClass = 'bg-cyan-100';
                textColorClass = 'text-cyan-500';
                break;
              default:
                bgColorClass = 'bg-primary-100';
                textColorClass = 'text-primary';
            }
          }
          
          return (
            <div 
              key={achievement.id} 
              className={cn(
                "flex flex-col items-center",
                !isUnlocked && "opacity-50"
              )}
            >
              <div className={cn(bgColorClass, "rounded-full p-3 mb-2")}>
                <Icon className={cn("h-7 w-7", textColorClass)} />
              </div>
              <h4 className="text-sm font-medium text-center">{achievement.name}</h4>
              <p className="text-xs text-gray-500">{isUnlocked ? "Unlocked" : "Locked"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
