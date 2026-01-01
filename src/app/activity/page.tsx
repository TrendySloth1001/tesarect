'use client';

import { useEffect, useState } from 'react';
import GitHeatmap from '@/components/GitHeatmap';
import Iridescence from '@/components/Iridescence';
import MagicCard from '@/components/MagicCard';

interface FileChange {
  path: string;
  status: string;
  additions: number;
  deletions: number;
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  files: FileChange[];
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
}

interface RepoData {
  commits: Commit[];
  files: FileChange[];
  totalCommits: number;
  repository?: {
    owner: string;
    repo: string;
  };
  error?: string;
}

interface HeatmapData {
  days: Array<{
    date: string;
    count: number;
    commits: Array<{
      sha: string;
      message: string;
      author: string;
    }>;
    level: number;
  }>;
  stats: {
    totalCommits: number;
    daysWithCommits: number;
    currentStreak: number;
    averageCommitsPerDay: string;
  };
}

export default function ActivityPage() {
  const [data, setData] = useState<RepoData | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repoRes, heatmapRes] = await Promise.all([
          fetch('/api/git/tree'),
          fetch('/api/git/heatmap')
        ]);
        
        const repoData = await repoRes.json();
        const heatmap = await heatmapRes.json();
        
        setData(repoData);
        setHeatmapData(heatmap);
      } catch (err) {
        console.error('Error fetching data:', err);
        setData({ commits: [], files: [], totalCommits: 0, error: 'Failed to fetch repository' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <div>Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <div>Error loading repository</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-green-400';
      case 'modified': return 'text-yellow-400';
      case 'removed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusSymbol = (status: string) => {
    switch (status) {
      case 'added': return '+';
      case 'modified': return '~';
      case 'removed': return '-';
      default: return '•';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono relative">
      {/* Animated Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 0,
        opacity: 0.4
      }}>
        <Iridescence
          speed={1}
          amplitude={0.1}
          mouseReact
        />
      </div>

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-2xl mb-2">
            {data.repository?.owner}/{data.repository?.repo}
          </h1>
          <div className="text-gray-400 text-sm">
            {data.totalCommits} recent commits • {data.files.length} files changed
          </div>
        </div>

        {/* Error State */}
        {data.error && (
          <div className="text-red-400 mb-8">
            Error: {data.error}
          </div>
        )}

        {/* Stats & Heatmap */}
        {heatmapData && heatmapData.days.length > 0 && (
          <div className="mb-6 border border-white/30 rounded-lg p-6" style={{ 
            backgroundColor: 'rgba(142, 142, 142, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-xl mb-6">Contribution Activity</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(142, 142, 142, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Total Commits</div>
                <div className="text-2xl font-bold">{heatmapData.stats.totalCommits}</div>
              </div>
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(142, 142, 142, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Active Days</div>
                <div className="text-2xl font-bold">{heatmapData.stats.daysWithCommits}</div>
              </div>
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(142, 142, 142, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Current Streak</div>
                <div className="text-2xl font-bold text-green-400">
                  {heatmapData.stats.currentStreak} days
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(142, 142, 142, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Avg/Day</div>
                <div className="text-2xl font-bold">{heatmapData.stats.averageCommitsPerDay}</div>
              </div>
            </div>

            {/* Heatmap */}
            <GitHeatmap days={heatmapData.days} />
          </div>
        )}

        {/* Commits */}
        {data.commits.length === 0 ? (
          <div className="text-gray-400">
            No commits found
          </div>
        ) : (
          <div className="space-y-4">
            {data.commits.map((commit) => (
              <div 
                key={commit.sha} 
                className="border border-white/30 rounded-lg p-4 hover:border-white/50 transition"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                {/* Commit Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-white mb-1">{commit.message}</div>
                    <div className="text-gray-500 text-sm">
                      {commit.author} • {commit.date}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm font-mono ml-4">
                    {commit.sha}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-3 text-sm">
                  <div className="text-green-400">
                    +{commit.stats.additions}
                  </div>
                  <div className="text-red-400">
                    -{commit.stats.deletions}
                  </div>
                  <div className="text-gray-400">
                    {commit.files.length} {commit.files.length === 1 ? 'file' : 'files'}
                  </div>
                </div>

                {/* Files */}
                <div className="space-y-1">
                  {commit.files.map((file: FileChange, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-1 px-2 hover:bg-gray-900/50 rounded text-sm"
                    >
                      <span className={getStatusColor(file.status)}>
                        {getStatusSymbol(file.status)}
                      </span>
                      <span className="flex-1">{file.path}</span>
                      <span className="text-gray-500 text-xs">
                        +{file.additions} -{file.deletions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
