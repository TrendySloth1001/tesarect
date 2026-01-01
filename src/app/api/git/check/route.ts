import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'TrendySloth1001';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Portfolio';

export async function GET() {
  try {
    const repoUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
    
    const response = await fetch(repoUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      repository: response.ok ? {
        name: data.name,
        fullName: data.full_name,
        private: data.private,
        isEmpty: data.size === 0,
        defaultBranch: data.default_branch,
        hasIssues: data.has_issues,
      } : null,
      error: !response.ok ? data : null,
      config: {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        hasToken: !!GITHUB_TOKEN
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
