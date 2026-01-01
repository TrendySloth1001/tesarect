import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  files?: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }>;
}

export async function GET() {
  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return NextResponse.json({
        commits: [],
        files: [],
        error: 'Missing GitHub configuration'
      });
    }

    // Get latest commits with file changes
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=10`,
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
        commits: [],
        files: [],
        error: `GitHub API error: ${commitsResponse.status}`
      });
    }

    const commits = await commitsResponse.json() as Commit[];

    // Get detailed commit info with file changes
    const detailedCommits = await Promise.all(
      commits.map(async (commit) => {
        const detailResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${commit.sha}`,
          {
            headers: {
              'Authorization': `token ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (detailResponse.ok) {
          const detail = await detailResponse.json();
          const commitDate = new Date(commit.commit.author.date);
          return {
            sha: commit.sha.substring(0, 7),
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commitDate.toLocaleString(),
            isoDate: commitDate.toISOString().split('T')[0],
            files: (detail.files || []).map((file: any) => ({
              path: file.filename,
              status: file.status,
              additions: file.additions,
              deletions: file.deletions,
              patch: file.patch || null
            })),
            stats: detail.stats || { additions: 0, deletions: 0, total: 0 }
          };
        }
        return null;
      })
    );

    const validCommits = detailedCommits.filter(c => c !== null);

    // Get all unique files from commits
    const allFiles = new Map();
    validCommits.forEach(commit => {
      commit.files.forEach((file: any) => {
        if (!allFiles.has(file.filename)) {
          allFiles.set(file.filename, {
            path: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
          });
        }
      });
    });

    return NextResponse.json({
      commits: validCommits,
      files: Array.from(allFiles.values()),
      totalCommits: validCommits.length,
      repository: {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      }
    });

  } catch (error) {
    console.error('Error fetching repository data:', error);
    return NextResponse.json({
      commits: [],
      files: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
