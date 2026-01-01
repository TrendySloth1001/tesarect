'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Waves from '@/components/Waves';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [markdownViewMode, setMarkdownViewMode] = useState<Record<string, 'preview' | 'diff'>>({});

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

  const isMarkdownFile = (path: string | undefined) => {
    if (!path) return false;
    return path.toLowerCase().endsWith('.md') || path.toLowerCase().endsWith('.markdown');
  };

  const extractMarkdownContent = (patch: string, status: string) => {
    const lines = patch.split('\n');
    const contentLines: string[] = [];
    let inCodeBlock = false;
    let skipNextLine = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip diff metadata lines
      if (line.startsWith('diff --git') || 
          line.startsWith('index ') || 
          line.startsWith('---') || 
          line.startsWith('+++') ||
          line.startsWith('@@')) {
        continue;
      }
      
      // Skip backslash lines (No newline at end of file)
      if (line.startsWith('\\')) {
        continue;
      }
      
      // Handle content based on status
      if (status === 'added') {
        // For added files, extract all + lines
        if (line.startsWith('+')) {
          const content = line.substring(1);
          
          // Handle nested markdown code blocks
          if (content.trim().startsWith('```markdown')) {
            // Skip the markdown fence, we'll render the content inside
            continue;
          }
          if (content.trim() === '```' && inCodeBlock) {
            // Skip closing fence of nested code block
            inCodeBlock = false;
            continue;
          }
          if (content.trim().startsWith('```')) {
            // Start of nested code block
            inCodeBlock = true;
            contentLines.push(content);
            continue;
          }
          
          contentLines.push(content);
        }
      } else {
        // For modified files, include context and additions
        if (line.startsWith('+') && !line.startsWith('+++')) {
          const content = line.substring(1);
          
          // Handle nested markdown code blocks
          if (content.trim().startsWith('```markdown')) {
            continue;
          }
          if (content.trim() === '```' && inCodeBlock) {
            inCodeBlock = false;
            continue;
          }
          if (content.trim().startsWith('```')) {
            inCodeBlock = true;
            contentLines.push(content);
            continue;
          }
          
          contentLines.push(content);
        } else if (!line.startsWith('-')) {
          // Context line (starts with space or nothing)
          const content = line.startsWith(' ') ? line.substring(1) : line;
          
          if (content.trim().startsWith('```markdown')) {
            continue;
          }
          if (content.trim() === '```' && inCodeBlock) {
            inCodeBlock = false;
            continue;
          }
          if (content.trim().startsWith('```')) {
            inCodeBlock = true;
            contentLines.push(content);
            continue;
          }
          
          if (content.trim().length > 0 || contentLines.length > 0) {
            contentLines.push(content);
          }
        }
      }
    }
    
    return contentLines.join('\n').trim();
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
        <Link 
          href="/activity" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to activity
        </Link>

        {/* Commit Header */}
        <div 
          className="border border-white/30 rounded-lg p-6 mb-6"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-2xl mb-2 prose prose-invert prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commit.message}</ReactMarkdown>
          </div>
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
                  {isMarkdownFile(file.path) ? (
                    <div className="bg-black/50">
                      {/* Tabs for Markdown Files */}
                      <div className="flex border-b border-white/10 bg-purple-500/5">
                        <button
                          onClick={() => setMarkdownViewMode(prev => ({ ...prev, [file.path]: 'preview' }))}
                          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                            (markdownViewMode[file.path] || 'preview') === 'preview'
                              ? 'text-purple-400 bg-purple-500/10'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          📝 Preview
                          {(markdownViewMode[file.path] || 'preview') === 'preview' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
                          )}
                        </button>
                        <button
                          onClick={() => setMarkdownViewMode(prev => ({ ...prev, [file.path]: 'diff' }))}
                          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                            markdownViewMode[file.path] === 'diff'
                              ? 'text-purple-400 bg-purple-500/10'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          🔧 Diff
                          {markdownViewMode[file.path] === 'diff' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
                          )}
                        </button>
                      </div>
                      
                      {/* Content */}
                      {(markdownViewMode[file.path] || 'preview') === 'preview' ? (
                        <div className="p-6 prose prose-invert max-w-none" style={{
                          fontSize: '1rem',
                          lineHeight: '1.75'
                        }}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 mt-6 text-white border-b border-gray-700 pb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 mt-5 text-white border-b border-gray-800 pb-1" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 mt-4 text-white" {...props} />,
                              h4: ({node, ...props}) => <h4 className="text-lg font-bold mb-2 mt-3 text-white" {...props} />,
                              p: ({node, ...props}) => <p className="mb-4 text-gray-200 leading-relaxed" {...props} />,
                              ul: ({node, ...props}) => <ul className="mb-4 ml-6 list-disc text-gray-200 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="mb-4 ml-6 list-decimal text-gray-200 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="text-gray-200" {...props} />,
                              code: ({node, inline, ...props}: any) => 
                                inline ? 
                                  <code className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-sm font-mono" {...props} /> :
                                  <code className="block p-4 bg-gray-900 rounded-lg text-sm font-mono overflow-x-auto" {...props} />,
                              pre: ({node, ...props}) => <pre className="mb-4 p-4 bg-gray-900 rounded-lg overflow-x-auto" {...props} />,
                              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4" {...props} />,
                              a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300 underline" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                            }}
                          >
                            {extractMarkdownContent(file.patch, file.status)}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="p-4">
                          <SyntaxHighlighter
                            language="diff"
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              padding: '1rem',
                              background: 'rgba(0, 0, 0, 0.5)',
                              fontSize: '0.875rem',
                              borderRadius: '0.5rem'
                            }}
                            showLineNumbers
                          >
                            {file.patch}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  ) : (
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
                  )}
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
