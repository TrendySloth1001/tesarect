import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'TrendySloth1001';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Portfolio';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');
    const commit = searchParams.get('commit');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }
    
    if (!commit) {
      return NextResponse.json({ error: 'Commit hash required for GitHub API' }, { status: 400 });
    }
    
    // Get commit details including patch/diff
    const commitUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${commit}`;
    
    const response = await fetch(commitUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    const commitData = await response.json();
    const file = commitData.files?.find((f: any) => f.filename === filename);
    
    if (!file) {
      return NextResponse.json({ error: 'File not found in commit' }, { status: 404 });
    }
    
    // GitHub provides the patch directly
    const diff = file.patch || `File ${file.status}: ${filename}\nNo diff available`;
    
    return NextResponse.json({ diff, filename, status: file.status });
  } catch (error) {
    console.error('Error fetching diff from GitHub:', error);
    return NextResponse.json({ error: 'Failed to fetch diff from GitHub' }, { status: 500 });
  }
}
