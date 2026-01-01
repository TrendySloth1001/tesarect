import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

export async function GET() {
  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return NextResponse.json({
        days: [],
        error: 'Missing GitHub configuration'
      });
    }

    // Get commits from the last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?since=${oneYearAgo.toISOString()}&per_page=1000`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!commitsResponse.ok) {
      const errorText = await commitsResponse.text();
      console.error('GitHub commits API error:', errorText);
      return NextResponse.json({
        days: [],
        error: `GitHub API error: ${commitsResponse.status}`
      });
    }

    const commits = await commitsResponse.json();

    // Process commits by date
    const commitsByDate = new Map<string, any>();
    
    for (const commit of commits) {
      const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
      
      if (!commitsByDate.has(date)) {
        commitsByDate.set(date, {
          date,
          count: 0,
          commits: []
        });
      }
      
      const dayData = commitsByDate.get(date);
      dayData.count++;
      dayData.commits.push({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
      });
    }

    // Generate all days in the last year
    const allDays = [];
    const today = new Date();
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = commitsByDate.get(dateStr);
      allDays.push({
        date: dateStr,
        count: dayData?.count || 0,
        commits: dayData?.commits || [],
        level: dayData ? Math.min(Math.ceil(dayData.count / 2), 4) : 0
      });
    }

    // Calculate stats
    const totalCommits = commits.length;
    const daysWithCommits = Array.from(commitsByDate.keys()).length;
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedDates = Array.from(commitsByDate.keys()).sort().reverse();
    const todayStr = today.toISOString().split('T')[0];
    
    if (sortedDates[0] === todayStr || sortedDates[0] === new Date(today.getTime() - 86400000).toISOString().split('T')[0]) {
      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (sortedDates.includes(expectedDateStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return NextResponse.json({
      days: allDays,
      stats: {
        totalCommits,
        daysWithCommits,
        currentStreak,
        averageCommitsPerDay: daysWithCommits > 0 ? (totalCommits / daysWithCommits).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return NextResponse.json({
      days: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
