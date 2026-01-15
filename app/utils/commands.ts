
export type CommandResponse = {
  type: 'text' | 'link' | 'error' | 'success' | 'image' | 'skills' | 'profile';
  content?: string;
  label?: string; // For links
  className?: string; // For custom styling
  skills?: { name: string; icon: string }[]; // For skill grid
};

export const COMMANDS = {
  HELP: 'help',
  ABOUT: 'about',
  PROJECTS: 'projects',
  CONTACT: 'contact',
  CLEAR: 'clear',
  SOCIALS: 'socials',
  TEST: 'test',
  OPEN: 'open',
  THEME: 'theme',
  SHUTDOWN: 'shutdown',
  LS: 'ls',
  CD: 'cd',
  CAT: 'cat',
  SNAKE: 'snake',
  SUDO: 'sudo',
  WHOAMI: 'whoami',
  DATE: 'date',
};

export const PROJECT_LIST = [
    { id: 1, label: 'AUTOPOD: Intelligent Container', url: 'https://github.com/Ajay73588/AUTOPOD_INTELLIGENT_CONTAINER' },
    { id: 2, label: 'Pulmo-track: Lung Health Monitoring', url: 'https://github.com/DINESHLINGAM-6/Pulmo-track' },
    { id: 3, label: 'AI-Chef: Intelligent Recipe Generator', url: 'https://github.com/Gurukrishnaa/AI-Chef' },
    { id: 4, label: 'CLI Portfolio (This website!)', url: 'https://github.com/Gurukrishnaa/cli-portfolio' },
];

export const processCommand = (cmd: string): CommandResponse[] => {
  const normalizedCmd = cmd.trim().toLowerCase();
  
  if (normalizedCmd.startsWith(COMMANDS.OPEN)) {
      const parts = normalizedCmd.split(' ');
      if (parts.length !== 2) {
          return [{ type: 'error', content: 'Usage: open <number>' }];
      }
      const id = parseInt(parts[1]);
      const project = PROJECT_LIST.find(p => p.id === id);
      
      if (!project) {
          return [{ type: 'error', content: `Project ${id} not found.` }];
      }
      return [{ type: 'success', content: `Opening ${project.label}...` }];
  }

  switch (normalizedCmd) {
    case COMMANDS.HELP:
      return [
        { type: 'text', content: 'Available commands:' },
        { type: 'text', content: '  about        - Learn more about me' },
        { type: 'text', content: '  projects     - View my works' },
        { type: 'text', content: '  socials      - Connect with me' },
        { type: 'text', content: '  contact      - Send me an email' },
        { type: 'text', content: '  ls           - List directory contents' },
        { type: 'text', content: '  cd <dir>     - Change directory' },
        { type: 'text', content: '  cat <file>   - Read file content' },
        { type: 'text', content: '  theme <name> - Change theme (matrix, cyberpunk, amber, dracula)' },
        { type: 'text', content: '  shutdown     - Turn off the system' },
        { type: 'text', content: '  clear        - Clear the terminal' },
      ];
    
    case COMMANDS.ABOUT:
      return [{ type: 'profile' }];

    case COMMANDS.PROJECTS:
      const projectList = PROJECT_LIST.map(p => ({
          type: 'link' as const,
          content: p.url,
          label: `${p.id}. ${p.label}`
      }));
      return [
        { type: 'text', content: 'Check out some of my recent work:' },
        ...projectList,
        { type: 'text', content: 'Type `open <number>` or click the links above (mouse support enabled).' },
      ];

    case COMMANDS.SOCIALS:
        return [
            { type: 'link', content: 'https://github.com/Gurukrishnaa', label: 'GitHub' },
            { type: 'link', content: 'https://www.linkedin.com/in/guru-krishnaa', label: 'LinkedIn' },
            { type: 'link', content: 'https://x.com/Batman_674', label: 'X (Twitter)' },
            { type: 'text', content: 'Type `contact` for email.' },
        ];
    
    case COMMANDS.CONTACT:
        return [
            { type: 'text', content: 'Email: gurukrishnaa.k@gmail.com' },
            { type: 'link', content: 'mailto:gurukrishnaa.k@gmail.com', label: 'Send Email' },
        ];

    case COMMANDS.SUDO:
        return [
            { type: 'error', content: 'Permission denied: access restricted to @gurukrishnaa' }
        ];

    case COMMANDS.WHOAMI:
        return [
            { type: 'text', content: 'visitor@portfolio' }
        ];

    case COMMANDS.DATE:
        return [
            { type: 'text', content: new Date().toString() }
        ];

    case COMMANDS.CLEAR:
      // Handled by the component, but good to have here for validation if needed
      return [];

    case COMMANDS.TEST:
      return [
        { type: 'text', content: 'Rickrolling in 3... 2... 1...' },
        { type: 'image', content: '/rick-roll-h2d7puir23see4lq-1667563362.gif' },
      ];

    case '':
      return [];

    default:
      return [{ type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` }];
  }
};
