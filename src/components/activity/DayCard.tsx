'use client';

import { useState } from 'react';
import FileTree from './FileTree';
import DiffViewer from './DiffViewer';

interface DayCardProps {
  date: string;
  dayNumber: number;
  commits?: Array<{
    hash: string;
    author: string;
    timestamp: number;
    message: string;
    files: any[];
    additions: number;
    deletions: number;
  }>;
  uncommittedFiles?: Array<{
    filename: string;
    status: string;
    staged: boolean;
  }>;
  totalFiles: number;
  totalAdditions: number;
  totalDeletions: number;
  isToday?: boolean;
}

export default function DayCard({
  date,
  dayNumber,
  commits = [],
  uncommittedFiles = [],
  totalFiles,
  totalAdditions,
  totalDeletions,
  isToday = false
}: DayCardProps) {
  const [expanded, setExpanded] = useState(isToday);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [diff, setDiff] = useState<string>('');
  const [diffMode, setDiffMode] = useState<'inline' | 'modal'>('inline');
  
  const hasActivity = commits.length > 0 || uncommittedFiles.length > 0;
  
  const handleFileClick = async (filename: string, commit?: string) => {
    setSelectedFile(filename);
    
    const url = `/api/git/diff?file=${encodeURIComponent(filename)}${commit ? `&commit=${commit}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    
    setDiff(data.diff);
    setDiffMode('inline');
  };
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-850"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-500">#{dayNumber}</span>
            {isToday && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">TODAY</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{formatDate(date)}</h3>
            {hasActivity ? (
              <div className="text-sm text-gray-400 mt-1">
                {commits.length > 0 && <span>{commits.length} commit{commits.length > 1 ? 's' : ''}</span>}
                {uncommittedFiles.length > 0 && (
                  <span className="ml-2 text-yellow-400">
                    🚧 {uncommittedFiles.length} uncommitted file{uncommittedFiles.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500">❌ No activity</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {hasActivity && (
            <>
              <div className="text-right text-sm">
                <div className="text-gray-400">{totalFiles} files</div>
                <div className="text-green-400">+{totalAdditions}</div>
                <div className="text-red-400">-{totalDeletions}</div>
              </div>
            </>
          )}
          <span className="text-gray-400">
            {expanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && hasActivity && (
        <div className="border-t border-gray-800 p-6 space-y-6">
          {/* Uncommitted Changes */}
          {uncommittedFiles.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-semibold mb-3">🚧 Uncommitted Changes</h4>
              <FileTree
                files={uncommittedFiles.map(f => ({
                  filename: f.filename,
                  status: f.status
                }))}
                onFileClick={(file) => handleFileClick(file)}
              />
            </div>
          )}
          
          {/* Commits */}
          {commits.map((commit, idx) => (
            <div key={commit.hash} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white font-semibold">{commit.message}</h4>
                  <div className="text-sm text-gray-400 mt-1">
                    {commit.author} • {new Date(commit.timestamp).toLocaleTimeString()}
                    <span className="ml-2 font-mono text-xs text-gray-600">{commit.hash.substring(0, 7)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400">+{commit.additions}</span>
                  <span className="mx-2">•</span>
                  <span className="text-red-400">-{commit.deletions}</span>
                </div>
              </div>
              
              <FileTree
                files={commit.files}
                onFileClick={(file) => handleFileClick(file, commit.hash)}
              />
            </div>
          ))}
          
          {/* Diff Viewer */}
          {selectedFile && diff && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-semibold text-gray-400">Diff Preview</h5>
                <button
                  onClick={() => setDiffMode('modal')}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Open in modal
                </button>
              </div>
              <DiffViewer
                diff={diff}
                filename={selectedFile}
                mode={diffMode}
                onClose={() => setDiffMode('inline')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
