'use client';

interface StatsCardProps {
  totalCommits: number;
  totalFiles: number;
  streak: number;
  contributionData: Record<string, number>;
}

export default function StatsCard({ totalCommits, totalFiles, streak, contributionData }: StatsCardProps) {
  // Generate last 12 weeks for contribution graph
  const weeks = generateWeeks(84); // 12 weeks
  
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 2) return 'bg-green-900';
    if (count <= 5) return 'bg-green-700';
    if (count <= 10) return 'bg-green-500';
    return 'bg-green-400';
  };
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-6">Repository Stats</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400">{totalCommits}</div>
          <div className="text-sm text-gray-400 mt-1">Total Commits</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-400">{totalFiles}</div>
          <div className="text-sm text-gray-400 mt-1">Files Tracked</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400">{streak}</div>
          <div className="text-sm text-gray-400 mt-1">Day Streak</div>
        </div>
      </div>
      
      {/* Contribution Graph */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Last 12 Weeks Activity</h3>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((date, dayIdx) => {
                const count = contributionData[date] || 0;
                return (
                  <div
                    key={date}
                    className={`w-3 h-3 rounded-sm ${getColor(count)} hover:ring-2 ring-white cursor-pointer transition`}
                    title={`${date}: ${count} commits`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-800 rounded-sm" />
            <div className="w-3 h-3 bg-green-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function generateWeeks(days: number): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  
  // Start from today and go back
  for (let week = 0; week < days / 7; week++) {
    const weekDays: string[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - (week * 7 + day)));
      weekDays.push(date.toISOString().split('T')[0]);
    }
    weeks.push(weekDays);
  }
  
  return weeks;
}
