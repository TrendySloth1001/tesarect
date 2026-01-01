'use client';

import { useEffect, useState } from 'react';
import GitHeatmap from '@/components/GitHeatmap';
import Waves from '@/components/Waves';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileChange {
  path: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
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
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

  const toggleCommit = (sha: string) => {
    setExpandedCommits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sha)) {
        newSet.delete(sha);
      } else {
        newSet.add(sha);
      }
      return newSet;
    });
  };

  const getLanguageFromPath = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'css': 'css',
      'scss': 'scss',
      'html': 'html',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
    };
    return langMap[ext || ''] || 'typescript';
  };

  const getCodePreview = (patch: string | undefined, maxLines = 5) => {
    if (!patch) return null;
    const lines = patch.split('\n').slice(0, maxLines);
    return lines.join('\n');
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
        zIndex: 0
      }}>
        <Waves
          lineColor="#5227FF"
          backgroundColor="transparent"
          waveSpeedX={0.06}
          waveSpeedY={0.045}
          waveAmpX={35}
          waveAmpY={25}
          friction={0.86}
          tension={0.01}
          maxCursorMove={120}
          xGap={10}
          yGap={22}
        />
      </div>

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        {/* Header */}
        <div 
          className="mb-8 rounded-lg p-4 md:p-6 border border-white/10"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent break-words">
                    {data.repository?.owner}/{data.repository?.repo}
                  </h1>
                  <a 
                    href={`https://github.com/${data.repository?.owner}/${data.repository?.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-gray-400 hover:text-purple-400 transition inline-flex items-center gap-1 mt-1"
                  >
                    View on GitHub
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-purple-300">{data.totalCommits} commits</span>
                </div>
                <div className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-blue-300">{data.files.length} files</span>
                </div>
                {heatmapData && (
                  <div className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs md:text-sm font-medium text-green-300">{heatmapData.stats.currentStreak} day streak</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-left lg:text-right text-xs md:text-sm text-gray-500 lg:flex-shrink-0">
              <div>Last updated</div>
              <div className="text-gray-400 font-mono text-xs md:text-sm">{new Date().toLocaleString()}</div>
            </div>
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
          <div className="mb-6 border border-white/10 rounded-lg p-6" style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <h2 className="text-xl mb-6">Contribution Activity</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Total Commits</div>
                <div className="text-2xl font-bold">{heatmapData.stats.totalCommits}</div>
              </div>
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Active Days</div>
                <div className="text-2xl font-bold">{heatmapData.stats.daysWithCommits}</div>
              </div>
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Current Streak</div>
                <div className="text-2xl font-bold text-green-400">
                  {heatmapData.stats.currentStreak} days
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                <div className="text-gray-400 text-xs mb-1">Avg/Day</div>
                <div className="text-2xl font-bold">{heatmapData.stats.averageCommitsPerDay}</div>
              </div>
            </div>

            {/* Heatmap */}
            <GitHeatmap 
              days={heatmapData.days} 
              onDayClick={(date) => setSelectedDay(date === selectedDay ? null : date)}
              selectedDay={selectedDay}
            />
          </div>
        )}

        {/* Commits */}
        {(() => {
          const commitsToShow = selectedDay 
            ? data.commits.filter(commit => commit.date.startsWith(selectedDay))
            : data.commits;
          
          return commitsToShow.length === 0 ? (
            <div className="text-gray-400">
              {selectedDay ? `No commits found for ${new Date(selectedDay).toLocaleDateString()}` : 'No commits found'}
            </div>
          ) : (
            <>
              {selectedDay && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-gray-400">Showing commits for {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    Show all commits
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {commitsToShow.map((commit) => {
              const isExpanded = expandedCommits.has(commit.sha);
              const filesToShow = isExpanded ? commit.files : commit.files.slice(0, 3);

              return (
                <div
                  key={commit.sha}
                  className="border border-white/10 rounded-lg p-4"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                >
                  {/* Commit Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        {/* Commit Type Icon */}
                        {commit.message.toLowerCase().includes('merge') ? (
                          <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.5 2.5a.5.5 0 01.5.5v9.793l2.146-2.147a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L7.5 12.793V3a.5.5 0 01.5-.5z"/>
                            <path fillRule="evenodd" d="M1.646 4.146a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L2.5 5.707V13a.5.5 0 01-1 0V3a.5.5 0 01.5-.5.5.5 0 01.146 0z"/>
                          </svg>
                        ) : commit.message.toLowerCase().match(/^(feat|feature)/i) ? (
                          <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        ) : commit.message.toLowerCase().match(/^(fix|bug)/i) ? (
                          <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : commit.message.toLowerCase().match(/^(docs|doc)/i) ? (
                          <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : commit.message.toLowerCase().match(/^(style|refactor)/i) ? (
                          <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        )}
                        <div className="text-white mb-1 flex-1">{commit.message}</div>
                      </div>
                      <div className="text-gray-500 text-sm ml-6">
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
                  <div className="space-y-2">
                    {filesToShow.map((file: FileChange, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-3 py-1 px-2 hover:bg-gray-900/50 rounded text-sm">
                          <span className={getStatusColor(file.status)}>
                            {getStatusSymbol(file.status)}
                          </span>
                          <span className="flex-1">{file.path}</span>
                          <span className="text-gray-500 text-xs">
                            +{file.additions} -{file.deletions}
                          </span>
                        </div>
                        
                        {/* Code Preview */}
                        {file.patch && (
                          <div className="ml-6 rounded-lg overflow-hidden border border-white/10">
                            <SyntaxHighlighter
                              language="diff"
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                padding: '0.75rem',
                                background: 'rgba(0, 0, 0, 0.5)',
                                fontSize: '0.75rem',
                                maxHeight: '150px',
                                overflow: 'auto'
                              }}
                              showLineNumbers={false}
                            >
                              {getCodePreview(file.patch, 8) || ''}
                            </SyntaxHighlighter>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Expand/Collapse Button */}
                  {commit.files.length > 3 && (
                    <button
                      onClick={() => toggleCommit(commit.sha)}
                      className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      {isExpanded ? '↑ Show less' : `↓ Show ${commit.files.length - 3} more files`}
                    </button>
                  )}

                  {/* View Full Diff Button */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <a
                      href={`/activity/commit/${commit.sha}`}
                      className="text-sm text-gray-400 hover:text-white transition inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View full diff
                    </a>
                  </div>
                </div>
              );
            })}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
