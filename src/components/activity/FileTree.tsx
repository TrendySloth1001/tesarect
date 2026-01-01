'use client';

import { useState } from 'react';

interface FileTreeProps {
  files: Array<{
    filename: string;
    status: string;
    additions?: number;
    deletions?: number;
  }>;
  onFileClick: (filename: string) => void;
}

export default function FileTree({ files, onFileClick }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  
  // Build tree structure
  const tree = buildTree(files);
  
  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };
  
  const renderTree = (node: TreeNode, path = '') => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    
    if (node.type === 'file') {
      const file = files.find(f => f.filename === node.fullPath);
      const statusColor = 
        file?.status === 'added' ? 'text-green-400' :
        file?.status === 'deleted' ? 'text-red-400' :
        'text-yellow-400';
      
      return (
        <div
          key={fullPath}
          onClick={() => onFileClick(node.fullPath!)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 cursor-pointer rounded"
        >
          <span className="text-gray-500">📄</span>
          <span className={statusColor}>{node.name}</span>
          {file && (
            <span className="ml-auto text-xs text-gray-500">
              {file.additions ? `+${file.additions}` : ''} 
              {file.deletions ? ` -${file.deletions}` : ''}
            </span>
          )}
        </div>
      );
    }
    
    const isExpanded = expanded.has(fullPath);
    
    return (
      <div key={fullPath}>
        <div
          onClick={() => toggleFolder(fullPath)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 cursor-pointer rounded"
        >
          <span>{isExpanded ? '📂' : '📁'}</span>
          <span className="text-gray-300">{node.name}</span>
          <span className="text-gray-600 text-xs">({node.children?.length})</span>
        </div>
        {isExpanded && node.children && (
          <div className="ml-4 border-l border-gray-700 pl-2">
            {node.children.map(child => renderTree(child, fullPath))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      {tree.map(node => renderTree(node))}
    </div>
  );
}

interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  fullPath?: string;
}

function buildTree(files: Array<{ filename: string }>): TreeNode[] {
  const root: TreeNode[] = [];
  
  files.forEach(file => {
    const parts = file.filename.split('/');
    let current = root;
    
    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1;
      let node = current.find(n => n.name === part);
      
      if (!node) {
        node = {
          name: part,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          fullPath: isFile ? file.filename : undefined
        };
        current.push(node);
      }
      
      if (node.children) {
        current = node.children;
      }
    });
  });
  
  return root;
}
