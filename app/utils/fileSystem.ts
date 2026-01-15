export type FileNode = {
  type: 'file' | 'dir';
  content?: string;
  children?: { [key: string]: FileNode };
};

export const FILE_SYSTEM: { [key: string]: FileNode } = {
  '~': {
    type: 'dir',
    children: {
      'about.txt': {
        type: 'file',
        content: `I am a Computer Science undergraduate at SRM Institute of Science and Technology
with a strong focus on backend engineering, data systems, and applied AI.
I care about building systems that are correct, explainable, and scalable under
real constraints rather than just producing demos.

I enjoy working close to data, APIs, and infrastructure, and I prefer designs
that are simple to reason about and easy to evolve.
This portfolio is built as a CLI to reflect how I naturally explore and explain systems.

Skills
------
Languages:
- TypeScript
- Python
- Go
- JavaScript
- Java
- SQL
- C / C++

Backend & Systems:
- Node.js, Express.js
- REST API
- Authentication & secure file handling
- PostgreSQL, MongoDB, MySQL
- Linux fundamentals

Frontend (supporting, not primary):
- React.js
- Tailwind CSS
- Next.js
- HTML / CSS / JavaScript

Tools:
- Git
- Docker
- Podman
- VS Code
- Firebase

Experience
----------
Full Stack Developer Intern — Infinitraq
- Worked across both frontend and backend layers of the product
- Implemented feature changes and bug fixes in React-based interfaces
- Developed and modified backend APIs using Node.js and Express.js
- Collaborated with existing codebases, adapting to established architecture and patterns
- Focused on improving reliability, data flow, and user-facing behavior without breaking existing functionality

Technical Team Member — ACM Student Chapter, SRMIST
- Collaborating on technical initiatives to promote practical computing skills
- Supporting workshops and peer learning focused on real-world development`
      },
      'portfolio.txt': {
        type: 'file',
        content: 'This is my interactive CLI Portfolio!\n\nNavigate to the `projects` directory to see my work:\n  cd projects\n  ls\n\nOr type `about` to learn more about me.'
      },
      'contact.txt': {
        type: 'file',
        content: 'Email: gurukrishnaa.k@gmail.com\nGitHub: github.com/Gurukrishnaa\nLinkedIn: linkedin.com/in/guru-krishnaa\nX: x.com/Batman_674'
      },
      'projects': {
        type: 'dir',
        children: {
          'autopod.txt': {
            type: 'file',
            content: 'Project: AUTOPOD_INTELLIGENT_CONTAINER\nDescription: Autonomous container system or deployment tool.\nLink: https://github.com/Ajay73588/AUTOPOD_INTELLIGENT_CONTAINER\n\nRun `open 1` to view.'
          },
          'pulmo-track.txt': {
            type: 'file',
            content: 'Project: Pulmo-track\nDescription: Lung health monitoring system.\nLink: https://github.com/DINESHLINGAM-6/Pulmo-track\n\nRun `open 2` to view.'
          },
          'ai-chef.txt': {
            type: 'file',
            content: 'Project: AI-Chef\nDescription: Intelligent recipe generator using AI.\nLink: https://github.com/Gurukrishnaa/AI-Chef\n\nRun `open 3` to view.'
          },
          'portfolio.txt': {
            type: 'file',
            content: 'Project: CLI Portfolio\nStack: Next.js, React, TailwindCSS\nDescription: The interactive terminal you are using right now.\n\nRun `open 4` to view source.'
          }
        }
      },
      'skills': {
        type: 'dir',
        children: {
          'languages.txt': { type: 'file', content: '- TypeScript\n- Python\n- Go\n- JavaScript\n- Java\n- SQL\n- C / C++' },
          'backend.txt': { type: 'file', content: '- Node.js, Express.js\n- REST API\n- Authentication\n- PostgreSQL, MongoDB, MySQL\n- Linux fundamentals' },
          'frontend.txt': { type: 'file', content: '- React.js\n- Tailwind CSS\n- Next.js\n- HTML / CSS / JS' },
          'tools.txt': { type: 'file', content: '- Git\n- Docker\n- Podman\n- VS Code\n- Firebase' }
        }
      },
      'README.md': {
        type: 'file',
        content: `# PortOS v1.0 (Beta)

Welcome to my digital playground. This is a fully interactive terminal portfolio.
It runs on Next.js but dreams of being a Linux distro.

## Features you might miss:
- **Snake Game**: Type \`snake\` to slack off.
- **Themes**: Type \`theme <tab>\` to switch aesthetics (Matrix, Cyberpunk, etc).
- **Secrets**: Try \`whoami\`, \`date\`, or \`sudo\`.
- **Real Email**: Type \`contact\` to send me a message directly from here.

## WARNINGS (Read Carefully):
- \`rm -rf /\` will NOT actually delete your hard drive, but it might hurt the terminal's feelings.
- \`test\` is purely for simulation. No real hacking involved (sadly).
- If you see a glitch, it's a feature. If you see two glitches, it's a Matrix sequel.
- \`sudo\` has no power here. You have no power here!

Made with love, code, and too much caffeine by Guru Krishnaa.`
      }
    }
  }
};
