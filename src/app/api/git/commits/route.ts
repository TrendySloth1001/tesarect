import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'TrendySloth1001';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Portfolio';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    // Fetch commits from GitHub API
    const commitsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?since=${since.toISOString()}&per_page=100`;
    
    const response = await fetch(commitsUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Return empty data instead of error for better UX
      return NextResponse.json({ 
        commitsByDate: [], 
        totalCommits: 0,
        error: errorData.message || response.statusText 
      });
    }
    
    const commits = await response.json();
    
    // Fetch detailed info for each commit including file changes
    const detailedCommits = await Promise.all(
      commits.slice(0, 50).map(async (commit: any) => {
        const detailUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${commit.sha}`;
        const detailResponse = await fetch(detailUrl, {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        if (detailResponse.ok) {
          return await detailResponse.json();
        }
        return null;
      })
    );
    
    const parsedCommits = detailedCommits.filter(c => c).map(parseGitHubCommit);
    const commitsByDate = groupCommitsByDate(parsedCommits);
    
    return NextResponse.json({ commitsByDate, totalCommits: parsedCommits.length });
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: 500 });
  }
}

function parseGitHubCommit(commit: any) {
  const files = commit.files || [];
  
  return {
    hash: commit.sha,
    author: commit.commit.author.name,
    email: commit.commit.author.email,
    timestamp: new Date(commit.commit.author.date).getTime(),
    message: commit.commit.message,
    files: files.map((file: any) => ({
      filename: file.filename,
      additions: file.additions,
      deletions: file.deletions,
      status: file.status,
      patch: file.patch
    })),
    additions: files.reduce((sum: number, f: any) => sum + f.additions, 0),
    deletions: files.reduce((sum: number, f: any) => sum + f.deletions, 0)
  };
}

function groupCommitsByDate(commits: any[]) {
  const groups: Record<string, any> = {};
  
  commits.forEach(commit => {
    const date = new Date(commit.timestamp).toISOString().split('T')[0];
    
    if (!groups[date]) {
      groups[date] = {
        date,
        commits: [],
        totalFiles: 0,
        totalAdditions: 0,
        totalDeletions: 0
      };
    }
    
    groups[date].commits.push(commit);
    groups[date].totalFiles += commit.files.length;
    groups[date].totalAdditions += commit.additions;
    groups[date].totalDeletions += commit.deletions;
  });
  
  return Object.values(groups).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
