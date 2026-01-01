import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'TrendySloth1001';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Portfolio';

export async function GET() {
  try {
    // Get repository info
    const repoUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
    const repoResponse = await fetch(repoUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!repoResponse.ok) {
      const errorData = await repoResponse.json().catch(() => ({}));
      console.error('GitHub API Error:', {
        status: repoResponse.status,
        statusText: repoResponse.statusText,
        error: errorData
      });
      
      // Return default stats instead of error
      return NextResponse.json({
        totalCommits: 0,
        totalFiles: 0,
        streak: 0,
        contributionData: {},
        error: errorData.message || repoResponse.statusText
      });
    }
    
    const repoData = await repoResponse.json();
    
    // Get commits for last 90 days
    const since = new Date();
    since.setDate(since.getDate() - 90);
    
    const commitsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?since=${since.toISOString()}&per_page=100`;
    const commitsResponse = await fetch(commitsUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!commitsResponse.ok) {
      const errorData = await commitsResponse.json().catch(() => ({}));
      console.error('GitHub API Error fetching commits:', errorData);
      
      // Return basic stats even if commits fail
      return NextResponse.json({
        totalCommits: 0,
        totalFiles: repoData.size || 0,
        streak: 0,
        contributionData: {},
        error: errorData.message || commitsResponse.statusText
      });
    }
    
    const commits = await commitsResponse.json();
    
    // Build contribution data
    const contributionData = getContributionData(commits);
    const streak = calculateStreak(contributionData);
    
    // Get total commit count from repo stats
    const totalCommits = await getTotalCommitCount();
    
    return NextResponse.json({
      totalCommits,
      totalFiles: repoData.size, // approximate
      streak,
      contributionData
    });
  } catch (error) {
    console.error('Error fetching stats from GitHub:', error);
    return NextResponse.json({ error: 'Failed to fetch stats from GitHub' }, { status: 500 });
  }
}

async function getTotalCommitCount() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=1`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (response.ok) {
      const link = response.headers.get('link');
      if (link) {
        const match = link.match(/page=(\d+)>; rel="last"/);
        if (match) {
          return parseInt(match[1]);
        }
      }
    }
  } catch (error) {
    console.error('Error getting total commit count:', error);
  }
  return 0;
}

function getContributionData(commits: any[]) {
  const data: Record<string, number> = {};
  
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
    data[date] = (data[date] || 0) + 1;
  });
  
  return data;
}

function calculateStreak(contributionData: Record<string, number>) {
  const dates = Object.keys(contributionData).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const daysDiff = Math.floor(
      (new Date(today).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
