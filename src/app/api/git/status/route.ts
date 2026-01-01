import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'TrendySloth1001';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Portfolio';

export async function GET() {
  try {
    // Get the latest commit to compare with
    const commitsUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=1`;
    
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
      
      // Return empty data instead of error
      return NextResponse.json({ 
        hasChanges: false,
        files: [],
        count: 0,
        error: errorData.message || response.statusText
      });
    }
    
    const commits = await response.json();
    
    // For GitHub, we can't get uncommitted changes
    // But we can show the most recent commit as "today's work"
    if (commits.length > 0) {
      const latestCommit = commits[0];
      const today = new Date().toISOString().split('T')[0];
      const commitDate = new Date(latestCommit.commit.author.date).toISOString().split('T')[0];
      
      // If the latest commit is from today, show it as "uncommitted" style
      if (commitDate === today) {
        const detailUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${latestCommit.sha}`;
        const detailResponse = await fetch(detailUrl, {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        if (detailResponse.ok) {
          const detail = await detailResponse.json();
          const files = (detail.files || []).map((file: any) => ({
            filename: file.filename,
            status: file.status,
            staged: true
          }));
          
          return NextResponse.json({ 
            hasChanges: files.length > 0,
            files,
            count: files.length,
            note: 'Showing latest commit from today'
          });
        }
      }
    }
    
    return NextResponse.json({ 
      hasChanges: false,
      files: [],
      count: 0
    });
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: 500 });
  }
}
