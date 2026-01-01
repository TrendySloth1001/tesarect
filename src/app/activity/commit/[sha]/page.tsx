'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
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

interface CommitDetail {
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

export default function CommitPage({ params }: { params: Promise<{ sha: string }> }) {
  const { sha } = use(params);
  const [commit, setCommit] = useState<CommitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommit = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${process.env.NEXT_PUBLIC_GITHUB_OWNER || 'TrendySloth1001'}/${process.env.NEXT_PUBLIC_GITHUB_REPO || 'Portfolio'}/commits/${sha}`, {
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch commit');

        const data = await response.json();
        
        setCommit({
          sha: data.sha.substring(0, 7),
          message: data.commit.message,
          author: data.commit.author.name,
          date: new Date(data.commit.author.date).toLocaleString(),
          files: data.files || [],
          stats: {
            additions: data.stats.additions,
            deletions: data.stats.deletions,
            total: data.stats.total
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCommit();
  }, [sha]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <div>Loading commit...</div>
      </div>
    );
  }

  if (error || !commit) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <div className="text-red-400">Error: {error || 'Commit not found'}</div>
        <a href="/activity" className="text-blue-400 hover:underline mt-4 inline-block">
          ← Back to activity
        </a>
      </div>
    );
  }

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
        {/* Back Button */}
        <a 
          href="/activity" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to activity
        </a>

        {/* Commit Header */}
        <div 
          className="border border-white/30 rounded-lg p-6 mb-6"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-2xl mb-2">{commit.message}</div>
          <div className="text-gray-400 text-sm mb-4">
            {commit.author} • {commit.date}
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500 font-mono">{commit.sha}</span>
            <span className="text-green-400">+{commit.stats.additions}</span>
            <span className="text-red-400">-{commit.stats.deletions}</span>
            <span className="text-gray-400">{commit.files.length} files changed</span>
          </div>
        </div>

        {/* Files */}
        <div className="space-y-4">
          {commit.files.map((file, idx) => (
            <div
              key={idx}
              className="border border-white/30 rounded-lg overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              {/* File Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={getStatusColor(file.status)}>
                    {getStatusSymbol(file.status)}
                  </span>
                  <span className="font-medium">{file.path}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  +{file.additions} -{file.deletions}
                </span>
              </div>

              {/* Diff */}
              {file.patch ? (
                <div className="overflow-x-auto">
                  <SyntaxHighlighter
                    language="diff"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.875rem'
                    }}
                    showLineNumbers
                  >
                    {file.patch}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="p-4 text-gray-500 text-sm">
                  {file.status === 'added' ? 'Binary file added' : 
                   file.status === 'removed' ? 'Binary file removed' : 
                   'Binary file modified'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
