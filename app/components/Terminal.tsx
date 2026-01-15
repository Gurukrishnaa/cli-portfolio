'use client';
import React, { useState, useEffect, useRef } from 'react';
import { processCommand, COMMANDS, CommandResponse, PROJECT_LIST } from '../utils/commands';
import { ASCII_HEADER } from '../utils/ascii';
import CyberBackground from './CyberBackground';
import { FILE_SYSTEM, FileNode } from '../utils/fileSystem';
import { THEMES, Theme } from '../utils/themes';
import SnakeGame from './SnakeGame';
import BootSequence from './BootSequence';
import UserProfile from './UserProfile';

type HistoryItem = {
  command: string;
  output: CommandResponse[];
  path?: string;
};



export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState<string[]>(['~']);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Resize state
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [isResizing, setIsResizing] = useState(false);

  // Window Controls state
  const [isClosed, setIsClosed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [theme, setTheme] = useState<Theme>(THEMES.matrix);
  const [isPlayingSnake, setIsPlayingSnake] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [prevSize, setPrevSize] = useState({ width: 900, height: 600 });
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Background/Idle state
  const [isActive, setIsActive] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cursor state
  const [cursorPos, setCursorPos] = useState(0);

  // Interaction Mode (e.g., 'command' or 'email')
  const [interactionMode, setInteractionMode] = useState<'command' | 'email'>('command');
  const [formStep, setFormStep] = useState(0); // 0: Idle, 1: Name, 2: Email, 3: Subject, 4: Message
  const [emailDraft, setEmailDraft] = useState({ name: '', email: '', subject: '', message: '' });

  // Center the window on initial load with safe dimensions
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const initialWidth = Math.min(1100, window.innerWidth - 40);
        const initialHeight = Math.min(700, window.innerHeight - 40);
        
        setSize({ width: initialWidth, height: initialHeight });
        
        setPosition({
            x: (window.innerWidth - initialWidth) / 2,
            y: (window.innerHeight - initialHeight) / 2
        });
    }
  }, []);

  // Handle Dragging and Resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Constrain to window bounds
        const boundedX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
        const boundedY = Math.max(0, Math.min(newY, window.innerHeight - size.height));

        setPosition({ x: boundedX, y: boundedY });
      }
      if (isResizing) {
        const maxWidth = window.innerWidth - position.x - 20; // 20px padding
        const maxHeight = window.innerHeight - position.y - 20;
        
        setSize({
            width: Math.max(400, Math.min(e.clientX - position.x, maxWidth)),
            height: Math.max(300, Math.min(e.clientY - position.y, maxHeight))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size]);

  // Handle Window Resize
  useEffect(() => {
      const handleWindowResize = () => {
          if (typeof window === 'undefined') return;
          
          // Adjust position if out of bounds
          setPosition(prev => ({
              x: Math.min(prev.x, Math.max(0, window.innerWidth - size.width)),
              y: Math.min(prev.y, Math.max(0, window.innerHeight - size.height))
          }));

          // Adjust size if too large
          setSize(prev => ({
              width: Math.min(prev.width, window.innerWidth - 40),
              height: Math.min(prev.height, window.innerHeight - 40)
          }));
      };

      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
  }, [size]);

  // Idle Detection
  useEffect(() => {
    const handleActivity = () => {
        setIsActive(true);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        
        idleTimerRef.current = setTimeout(() => {
            setIsActive(false);
        }, 5000); // 5 seconds of inactivity = idle
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
        setIsDragging(true);
        const rect = windowRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && interactionMode === 'command') return;

    // Handle Email Interaction Mode
    // Handle Email Interaction Mode
    if (interactionMode === 'email') {
        const value = input;
        setInput('');
        setCursorPos(0);

        // Display user input
        setHistory(prev => [...prev, { 
            command: '', 
            output: [{ type: 'text', content: value, className: 'text-white' }],
            path: ''
        }]);

        if (formStep === 1) { // Name captured
            setEmailDraft(prev => ({ ...prev, name: value }));
            setFormStep(2);
            setHistory(prev => [...prev, { command: '', output: [{ type: 'text', content: 'Your Email:', className: 'text-yellow-400' }], path: '' }]);
            return;
        }

        if (formStep === 2) { // Email captured
            setEmailDraft(prev => ({ ...prev, email: value }));
            setFormStep(3);
            setHistory(prev => [...prev, { command: '', output: [{ type: 'text', content: 'Subject:', className: 'text-yellow-400' }], path: '' }]);
            return;
        }

        if (formStep === 3) { // Subject captured
            setEmailDraft(prev => ({ ...prev, subject: value }));
            setFormStep(4);
            setHistory(prev => [...prev, { command: '', output: [{ type: 'text', content: 'Message:', className: 'text-yellow-400' }], path: '' }]);
            return;
        }

        if (formStep === 4) { // Message captured, SEND
            const finalDraft = { ...emailDraft, message: value };
            
            setHistory(prev => [...prev, { 
                command: '', 
                output: [{ type: 'text', content: 'Sending transmission...', className: 'text-blue-400' }],
                path: ''
            }]);

            // Send to API
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalDraft),
                });

                const data = await response.json();

                if (response.ok) {
                    setHistory(prev => [...prev, { 
                        command: '', 
                        output: [
                            { type: 'success', content: `Message queued for deliver to gurukrishnaa.k@gmail.com` },
                            { type: 'text', content: 'Transmission complete.' }
                        ],
                        path: ''
                    }]);
                } else {
                    throw new Error(data.message || 'Transmission failed.');
                }
            } catch (error) {
                setHistory(prev => [...prev, { 
                    command: '', 
                    output: [
                        { type: 'error', content: `Transmission Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
                        { type: 'text', content: 'Please try sending manually.' }
                    ],
                    path: ''
                }]);
            }

            setInteractionMode('command');
            setFormStep(0);
            setEmailDraft({ name: '', email: '', subject: '', message: '' });
            return;
        }
    }

    const cmd = input.startsWith('/') ? input.slice(1) : input;
    const cmdLower = cmd.trim().toLowerCase();
    const originalInput = input;
    
    setInput('');
    setCursorPos(0);
    setHistoryIndex(-1); // Reset history navigation

    // Add to command history if not empty
    if (originalInput.trim()) {
        setCmdHistory(prev => [...prev, originalInput]);
    }

    if (cmdLower === COMMANDS.CLEAR) {
      setHistory([]);
      return;
    }

    if (cmdLower === COMMANDS.TEST) {
        setHistory(prev => [...prev, { 
            command: originalInput, 
            output: [{ type: 'text', content: 'Initializing hack protocol...' }] 
        }]);

        await new Promise(resolve => setTimeout(resolve, 800));
        
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output = [
                { type: 'text', content: 'Initializing hack protocol... [OK]' },
                { type: 'text', content: 'Bypassing firewalls...' }
            ];
            return newHistory;
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output = [
                { type: 'text', content: 'Initializing hack protocol... [OK]' },
                { type: 'text', content: 'Bypassing firewalls... [OK]' },
                { type: 'text', content: 'Downloading payload...' }
            ];
            return newHistory;
        });

        await new Promise(resolve => setTimeout(resolve, 1200));

        const finalOutput = processCommand(cmd);
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output = finalOutput;
            return newHistory;
        });
        return;
    }

    if (cmdLower.startsWith(COMMANDS.OPEN)) {
        const parts = cmdLower.split(' ');
        if (parts.length === 2) {
            const id = parseInt(parts[1]);
            const project = PROJECT_LIST.find(p => p.id === id);
            if (project) {
                window.open(project.url, '_blank');
            }
        }
    }

    // --- File System Commands ---
    
    // Helper to get current directory node
    const getCurrentDir = (): FileNode | null => {
        let current = FILE_SYSTEM['~'];
        // Traverse currentPath (skip first '~' as we start at root)
        for (let i = 1; i < currentPath.length; i++) {
            if (current.children && current.children[currentPath[i]]) {
                current = current.children[currentPath[i]];
            } else {
                return null;
            }
        }
        return current;
    };
    
    // Snapshot current path for history
    const pathSnapshot = currentPath.join('/');

    if (cmdLower === 'ls') {
        const dir = getCurrentDir();
        if (dir && dir.children) {
            const files = Object.keys(dir.children).map(name => {
                const isDir = dir.children![name].type === 'dir';
                return { 
                    type: 'text' as const, 
                    content: `${name}${isDir ? '/' : ''}`,
                    className: isDir ? 'text-blue-400 font-bold' : 'text-green-300'
                };
            });
            // Sort: directories first, then files
            files.sort((a, b) => {
                const aIsDir = a.content.endsWith('/');
                const bIsDir = b.content.endsWith('/');
                if (aIsDir === bIsDir) return a.content.localeCompare(b.content);
                return aIsDir ? -1 : 1;
            });
            
            setHistory(prev => [...prev, { command: input, output: files, path: pathSnapshot }]);
        } else {
             setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: 'Not a directory' }], path: pathSnapshot }]);
        }
        return;
    }

    if (cmdLower === 'cd' || cmdLower.startsWith('cd ')) {
        const target = cmdLower === 'cd' ? '~' : cmdLower.substring(3).trim();
        if (!target) {
            // cd with space but empty target also goes home
            setCurrentPath(['~']);
            setHistory(prev => [...prev, { command: input, output: [], path: pathSnapshot }]);
             return;
        }

        if (target === '..') {
            if (currentPath.length > 1) {
                setCurrentPath(prev => prev.slice(0, -1));
                setHistory(prev => [...prev, { command: input, output: [], path: pathSnapshot }]);
            } else {
                setHistory(prev => [...prev, { command: input, output: [], path: pathSnapshot }]);
            }
        } else if (target === '~') {
            setCurrentPath(['~']);
             setHistory(prev => [...prev, { command: input, output: [], path: pathSnapshot }]);
        } else {
            const dir = getCurrentDir();
            if (dir && dir.children) {
                // Case-insensitive lookup
                const actualKey = Object.keys(dir.children).find(k => k.toLowerCase() === target.toLowerCase());
                
                if (actualKey) {
                    if (dir.children[actualKey].type === 'dir') {
                        setCurrentPath(prev => [...prev, actualKey]);
                        setHistory(prev => [...prev, { command: input, output: [], path: pathSnapshot }]);
                    } else {
                        setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `cd: ${target}: Not a directory` }], path: pathSnapshot }]);
                    }
                } else {
                    setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `cd: ${target}: No such file or directory` }], path: pathSnapshot }]);
                }
            } else {
                setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `cd: ${target}: No such file or directory` }], path: pathSnapshot }]);
            }
        }
        return;
    }

    if (cmdLower === 'cat' || cmdLower.startsWith('cat ')) {
        const target = cmdLower === 'cat' ? '' : cmdLower.substring(4).trim();
        if (!target) {
             setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: 'Usage: cat <filename>' }], path: pathSnapshot }]);
             return;
        }

        const dir = getCurrentDir();
        if (dir && dir.children) {
            // Case-insensitive lookup
            const actualKey = Object.keys(dir.children).find(k => k.toLowerCase() === target.toLowerCase());

            if (actualKey) {
                if (dir.children[actualKey].type === 'file') {
                    setHistory(prev => [...prev, { 
                        command: input, 
                        output: [{ type: 'text', content: dir.children![actualKey].content || '' }],
                        path: pathSnapshot
                    }]);
                } else {
                    setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `cat: ${target}: Is a directory` }], path: pathSnapshot }]);
                }
            } else {
                setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `cat: ${target}: No such file or directory` }], path: pathSnapshot }]);
            }
        } else {
            setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `cat: ${target}: No such file or directory` }], path: pathSnapshot }]);
        }
        return;
    }



    if (cmdLower === 'rm -rf /' || cmdLower === 'rm -rf /*') {
        setHistory(prev => [...prev, { command: input, output: [{ type: 'text', content: 'Deleting system files...' }], path: pathSnapshot }]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: 'CRITICAL ERROR: KERNEL PANIC' }], path: pathSnapshot }]);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsCrashed(true);

        // Auto reboot after 5 seconds
        setTimeout(() => {
            setIsCrashed(false);
            setHistory([]);
        }, 5000);
        return;
    }

    if (cmdLower === COMMANDS.SHUTDOWN) {
        setHistory(prev => [...prev, { command: input, output: [{ type: 'text', content: 'System halting...' }], path: pathSnapshot }]);
        setTimeout(() => setIsClosed(true), 800);
        return;
    }

    // Intercept CONTACT command for interactive mode
    if (cmdLower === 'contact') {
        setHistory(prev => [...prev, { 
            command: input, 
            output: [
                { type: 'text', content: 'Initiating secure transmission protocol...' },
                { type: 'text', content: 'Press ESC to cancel at any time.', className: 'text-zinc-500 italic' },
                { type: 'text', content: ' ' },
                { type: 'text', content: 'Your Name:', className: 'text-yellow-400' }
            ], 
            path: pathSnapshot 
        }]);
        setInteractionMode('email');
        setFormStep(1); // Start at step 1
        return;
    }

    if (cmdLower === 'snake') {
        setIsPlayingSnake(true);
        return;
    }

    if (cmdLower.startsWith('theme')) {
        const themeName = cmdLower.substring(5).trim(); // 'theme'.length is 5
        if (!themeName) {
            const available = Object.keys(THEMES).join(', ');
            setHistory(prev => [...prev, { command: input, output: [{ type: 'text', content: `Usage: theme <name>\nAvailable themes: ${available}` }], path: pathSnapshot }]);
            return;
        }

        if (THEMES[themeName]) {
            setTheme(THEMES[themeName]);
            setHistory(prev => [...prev, { command: input, output: [{ type: 'text', content: `Theme changed to ${themeName}` }], path: pathSnapshot }]);
        } else {
            const available = Object.keys(THEMES).join(', ');
            setHistory(prev => [...prev, { command: input, output: [{ type: 'error', content: `Theme '${themeName}' not found. Available: ${available}` }], path: pathSnapshot }]);
        }
        return;
    }

    const output = processCommand(cmd);
    setHistory((prev) => [...prev, { command: input, output, path: pathSnapshot }]); // Keep original input in history
  };

  // Always focus input when clicking anywhere in content
  const handleContentClick = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);
  
  // Handle input change with autocomplete logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      setCursorPos(e.target.selectionStart || 0);

      if (value.startsWith('/')) {
        const searchTerm = value.slice(1).toLowerCase();
        const matches = Object.values(COMMANDS).filter(cmd => 
            cmd.toLowerCase().includes(searchTerm)
        );
        setFilteredCommands(matches);
        setShowSuggestions(matches.length > 0);
        setSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
      // Update cursor position on keydown for immediate feedback
      requestAnimationFrame(() => setCursorPos(inputRef.current?.selectionStart || 0));

      if (e.key === 'Escape') {
          if (interactionMode === 'email') {
              setInteractionMode('command');
              setFormStep(0);
              setEmailDraft({ name: '', email: '', subject: '', message: '' });
              setInput('');
              setHistory(prev => [...prev, { command: '', output: [{ type: 'error', content: 'Transformation aborted.' }], path: '' }]);
              return;
          }
      }

      if (showSuggestions && filteredCommands.length > 0) {
          if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSuggestionIndex(prev => Math.max(0, prev - 1));
          } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSuggestionIndex(prev => Math.min(filteredCommands.length - 1, prev + 1));
          } else if (e.key === 'Enter' || e.key === 'Tab') {
              e.preventDefault();
              const selectedCmd = filteredCommands[suggestionIndex];
              setInput(selectedCmd);
              setShowSuggestions(false);
              // Focus remains on input
              setShowSuggestions(false);
          }
      } else {
          // History Navigation
          if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (cmdHistory.length > 0) {
                  const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
                  setHistoryIndex(newIndex);
                  const newVal = cmdHistory[newIndex];
                  setInput(newVal);
                  requestAnimationFrame(() => setCursorPos(newVal.length));
              }
          } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (historyIndex !== -1) {
                  if (historyIndex < cmdHistory.length - 1) {
                      const newIndex = historyIndex + 1;
                      setHistoryIndex(newIndex);
                      const newVal = cmdHistory[newIndex];
                      setInput(newVal);
                      requestAnimationFrame(() => setCursorPos(newVal.length));
                  } else {
                      setHistoryIndex(-1);
                      setInput('');
                      setCursorPos(0);
                  }
              }
          }
      }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
      setCursorPos(e.currentTarget.selectionStart || 0);
  };

  const handleClose = () => setIsClosed(true);
  
  const handleMinimize = () => setIsMinimized(prev => !prev);
  
  const handleMaximize = () => {
      if (isMaximized) {
          // Restore
          setSize(prevSize);
          setPosition(prevPos);
      } else {
          // Maximize
          setPrevSize(size);
          setPrevPos(position);
          setSize({ width: window.innerWidth, height: window.innerHeight });
          setPosition({ x: 0, y: 0 });
      }
      setIsMaximized(prev => !prev);
  };

  const handleReboot = () => {
      setIsClosed(false);
      setIsCrashed(false);
      setInput('');
      setHistory([]);
      setIsBooting(true);
      // Reset to default size/pos logic if needed, or keep previous
  };

  if (isCrashed) {
      return (
          <div className="fixed inset-0 bg-blue-700 text-white font-mono p-10 z-50 flex flex-col items-start justify-center select-none cursor-none">
              <h1 className="text-9xl mb-10">:(</h1>
              <h2 className="text-4xl mb-6">Your PC ran into a problem and needs to restart.</h2>
              <p className="text-xl mb-10">We're just collecting some error info, and then we'll restart for you.</p>
              <p className="text-xl">0% complete</p>
              <div className="mt-10">
                  <p className="text-sm opacity-80">Stop code: CRITICAL_PROCESS_DIED</p>
                  <p className="text-sm opacity-80">What failed: user_curiosity.sys</p>
              </div>
          </div>
      );
  }

  if (isClosed) {
      return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
            <CyberBackground isActive={false} />
            <button 
                onClick={handleReboot}
                className="z-10 bg-black/50 border border-green-500 text-green-500 px-6 py-3 rounded text-xl font-mono hover:bg-green-500 hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,0,0.3)]"
            >
                Initialize System
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Dynamic Background */}
      <CyberBackground isActive={isActive} color={theme.hex} />

      {/* Terminal Window */}
      <div 
        ref={windowRef}
        style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: isMinimized ? 'auto' : `${size.height}px`,
            position: 'absolute',
            transition: isMaximized ? 'all 0.3s ease' : 'none'
        }}
        className={`bg-black/10 backdrop-blur-sm rounded-lg ${theme.glow} border ${theme.border} flex flex-col overflow-hidden ${isMaximized ? 'rounded-none border-0' : ''}`}
      >
        {/* Title Bar (Draggable Handle) */}
        <div 
            onMouseDown={!isMaximized ? handleMouseDown : undefined}
            onDoubleClick={handleMaximize}
            className={`bg-zinc-900/30 px-4 py-2 flex items-center justify-between border-b ${theme.border} select-none cursor-default`}
        >
            <div className="flex gap-2 group">
                <div onClick={handleClose} className={`w-3 h-3 rounded-full opacity-50 hover:opacity-100 transition-opacity cursor-pointer ${theme.buttonClose}`}></div>
                <div onClick={handleMinimize} className={`w-3 h-3 rounded-full opacity-50 hover:opacity-100 transition-opacity cursor-pointer ${theme.buttonMin}`}></div>
                <div onClick={handleMaximize} className={`w-3 h-3 rounded-full opacity-50 hover:opacity-100 transition-opacity cursor-pointer ${theme.buttonMax}`}></div>
            </div>
            <div className={`${theme.text} text-sm font-mono flex items-center gap-2 opacity-100 font-bold`}>
                <span>📁</span>
                <span>gurukrishnaa@portfolio:{currentPath.join('/')}</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Terminal Content - Hidden if minimized */}
        {!isMinimized && (
            isBooting ? (
                <BootSequence theme={theme} onComplete={() => setIsBooting(false)} />
            ) : isPlayingSnake ? (
                <SnakeGame theme={theme} onExit={() => {
                    setIsPlayingSnake(false);
                    // Refocus input after game
                    setTimeout(() => inputRef.current?.focus(), 100);
                }} />
            ) : (
        <div 
            ref={containerRef}
            onClick={handleContentClick}
            className={`flex-1 overflow-y-auto p-4 font-mono ${theme.text}`}
        >
            {/* ASCII Header */}
            <pre className={`${theme.text} font-bold mb-8 leading-none select-none text-[8px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base opacity-80`}>
                {ASCII_HEADER}
            </pre>

            {/* Welcome Message */}
            <div className={`mb-6 ${theme.textBold} opacity-90`}>
            <p>Welcome to Portfolio CLI v1.0.0</p>
            <p>Type <span className="text-white font-bold">'help'</span>or <span className="text-white font-bold">'/'</span> to see available commands.</p>
            </div>

            {/* History */}
            {history.map((item, index) => (
            <div key={index} className="mb-2">
                <div className="flex">
                <span className={`mr-2 ${theme.textDim} min-w-fit font-bold`}>gurukrishnaa@portfolio:~$</span>
                <span className="text-white break-all">{item.command}</span>
                </div>
                <div className="ml-4 mt-1">
                {item.output.map((line, i) => (
                    <div key={i} className={`${line.type === 'error' ? 'text-red-500' : (line as any).className ? (line as any).className : theme.text} mb-1`}>
                    {line.type === 'link' ? (
                        <a href={line.content} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-100 decoration-green-500/30 hover:decoration-green-500">
                            {line.label || line.content}
                        </a>
                    ) : line.type === 'image' ? (
                        <img src={line.content} alt="Rick Roll" className="w-64 h-auto rounded-md opacity-80 hover:opacity-100 transition-opacity" />
                    ) : line.type === 'skills' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 max-w-lg">
                            {line.skills?.map(skill => (
                                <div key={skill.name} className={`flex flex-col items-center justify-center p-3 rounded border border-white/10 ${theme.bg && theme.bg.includes('black') ? 'bg-zinc-900' : 'bg-black/20'} hover:bg-white/10 transition-all group`}>
                                    <img 
                                        src={`https://cdn.simpleicons.org/${skill.icon}/${theme.text?.includes('black') ? '000000' : 'ffffff'}`} 
                                        alt={skill.name} 
                                        className="w-8 h-8 mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    {/* Fallback icon if image fails */}
                                    <div className="hidden text-2xl mb-2">⚡</div>
                                    <span className={`text-xs font-bold ${theme.text}`}>{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : line.type === 'profile' ? (
                        <UserProfile theme={theme} />
                    ) : (
                        <span className={`break-words whitespace-pre-wrap ${line.className || ''}`}>{line.content}</span>
                    )}
                    </div>
                ))}
                </div>
            </div>
            ))}

            {/* Input Area */}
            <div className="mt-4 pt-4 border-t border-green-900/30 relative">
                {/* Suggestions Dropdown (List Layout) */}
                {showSuggestions && filteredCommands.length > 0 && (
                    <div className={`absolute top-full left-0 mt-2 w-64 bg-black border ${theme.border} rounded-md shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden z-50`}>
                        {filteredCommands.map((cmd, index) => (
                            <div 
                                key={cmd}
                                className={`px-4 py-2 cursor-pointer transition-colors ${
                                    index === suggestionIndex 
                                        ? `${theme.bg} text-black font-bold` 
                                        : `${theme.text} hover:bg-zinc-800`
                                }`}
                                onClick={() => {
                                    setInput(cmd);
                                    setShowSuggestions(false);
                                    inputRef.current?.focus();
                                }}
                            >
                                {cmd}
                            </div>
                        ))}
                    </div>
                )}


                <form onSubmit={handleCommand} className={`flex items-center relative gap-2 p-3 rounded-md border ${theme.border} bg-black/40 focus-within:${theme.border.replace('/30', '/80')} transition-colors`}>
                    <span className={`${theme.text} font-bold text-lg whitespace-nowrap`}>
                        {interactionMode === 'email' ? 
                            (formStep === 1 ? 'Name >' : 
                             formStep === 2 ? 'Email >' : 
                             formStep === 3 ? 'Subject >' : 
                             'Message >') 
                            : '›'}
                    </span>
                    
                    <div className="relative flex-1">
                        {/* Visual Custom Cursor Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex whitespace-pre-wrap break-words items-center h-full">
                            <span className="text-white">{input.slice(0, cursorPos)}</span>
                            <span className={`${theme.bg} text-black animate-cursor-blink leading-none self-end mb-[2px] h-[1.2em]`}>
                                {input[cursorPos] || '\u00A0'}
                            </span>
                            <span className="text-white">{input.slice(cursorPos + 1)}</span>
                        </div>
                        
                        {!input && (
                            <div className={`absolute inset-0 pointer-events-none ${theme.textDim} opacity-50 italic flex items-center`}>
                                {interactionMode === 'email' ? '...' : "Type 'help' to start..."}
                            </div>
                        )}

                        {/* Actual Input (Transparent) */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onSelect={handleSelect}
                            className="w-full bg-transparent border-none outline-none text-transparent caret-transparent py-0 h-full cursor-text"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                </form>
            </div>
        </div>
            )
        )}
        
        {/* Resize Handle (Invisible but functional) - Disable if maximized or minimized */}
        {!isMaximized && !isMinimized && (
        <div 
            onMouseDown={(e) => {
                e.stopPropagation(); // Prevent drag start
                setIsResizing(true);
            }}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-20"
        />
        )}
      </div>
    </div>
  );
}
