'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DiffViewerProps {
  diff: string;
  filename: string;
  mode?: 'inline' | 'modal';
  onClose?: () => void;
}

export default function DiffViewer({ diff, filename, mode = 'inline', onClose }: DiffViewerProps) {
  const lines = diff.split('\n');
  const language = getLanguageFromFilename(filename);
  
  const renderInline = () => (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-gray-300 font-mono text-sm">{filename}</span>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm font-mono">
          <tbody>
            {lines.map((line, idx) => {
              const type = line[0] === '+' ? 'add' : line[0] === '-' ? 'remove' : 'neutral';
              const bgColor = type === 'add' ? 'bg-green-900/30' : type === 'remove' ? 'bg-red-900/30' : '';
              
              return (
                <tr key={idx} className={bgColor}>
                  <td className="px-2 py-0.5 text-gray-500 select-none w-12 text-right">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-0.5">
                    <span className={
                      type === 'add' ? 'text-green-400' : 
                      type === 'remove' ? 'text-red-400' : 
                      'text-gray-300'
                    }>
                      {line || ' '}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const renderModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{filename}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {renderInline()}
        </div>
      </div>
    </div>
  );
  
  return mode === 'inline' ? renderInline() : renderModal();
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'json': 'json',
    'css': 'css',
    'html': 'html',
    'md': 'markdown',
    'py': 'python',
    'rs': 'rust',
    'go': 'go',
  };
  return map[ext || ''] || 'text';
}
