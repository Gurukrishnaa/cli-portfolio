'use client';

import React from 'react';
import { Theme } from '../utils/themes';

interface UserProfileProps {
  theme: Theme;
}

const UserProfile: React.FC<UserProfileProps> = ({ theme }) => {
  return (
    <div className={`my-4 border ${theme.border} bg-black/30 rounded-lg overflow-hidden max-w-2xl w-full`}>
      {/* Header Banner */}
      <div className={`p-6 relative overflow-hidden bg-zinc-900/80 border-b ${theme.border}`}>
        <div className={`absolute top-0 right-0 p-4 opacity-10 text-6xl font-black select-none pointer-events-none ${theme.text}`}>
            DEV
        </div>
        <div className="flex items-center gap-6 relative z-10">
            {/* Avatar Placeholder / Initial */}
            <div className={`w-20 h-20 rounded-full border-2 ${theme.border} flex items-center justify-center bg-black text-3xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.3)] ${theme.text} relative group overflow-hidden`}>
                <div className={`absolute inset-0 ${theme.bg} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                GK
            </div>
            <div>
                <h1 className={`text-3xl font-black tracking-tight mb-1 ${theme.text} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>GURU KRISHNAA</h1>
                <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">Backend Engineer • Applied AI</p>
                <div className="flex gap-2 mt-3 text-xs">
                    <span className={`px-2 py-1 bg-black/40 rounded-md border ${theme.border} text-zinc-300`}>SRMIST</span>
                    <span className={`px-2 py-1 bg-black/40 rounded-md border ${theme.border} text-zinc-300`}>Chennai, IN</span>
                </div>
            </div>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Left Column: Bio & Skills */}
          <div>
              <h3 className={`text-sm font-bold opacity-80 mb-3 uppercase border-b ${theme.border} pb-1 ${theme.text}`}>// System.Bio</h3>
              <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                  Building systems that are <span className={`${theme.text} font-bold`}>correct</span>, <span className={`${theme.text} font-bold`}>explainable</span>, and <span className={`${theme.text} font-bold`}>scalable</span>. 
                  Focusing on backend architecture, data systems, and real-world AI constraints.
              </p>

              <h3 className={`text-sm font-bold opacity-80 mb-3 uppercase border-b ${theme.border} pb-1 ${theme.text}`}>// Core_Matrix</h3>
              <div className="grid grid-cols-4 gap-2">
                 {[
                     { n: 'TS', i: 'typescript' }, { n: 'Py', i: 'python' }, { n: 'Go', i: 'go' }, { n: 'C++', i: 'cplusplus' },
                     { n: 'Node', i: 'nodedotjs' }, { n: 'SQL', i: 'postgresql' }, { n: 'Dock', i: 'docker' }, { n: 'Linux', i: 'linux' }
                 ].map(s => (
                     <div key={s.n} className={`flex flex-col items-center justify-center p-2 bg-black/40 rounded border ${theme.border} hover:bg-white/5 transition-colors`} title={s.n}>
                         <img src={`https://cdn.simpleicons.org/${s.i}/${theme.text?.includes('black') ? '000000' : 'ffffff'}`} alt={s.n} className="w-5 h-5 mb-1 opacity-80" />
                         <span className="text-[9px] text-zinc-400 font-mono">{s.n}</span>
                     </div>
                 ))}
              </div>
          </div>

          {/* Right Column: Experience Timeline */}
          <div className="relative">
             <h3 className={`text-sm font-bold opacity-80 mb-4 uppercase border-b ${theme.border} pb-1 ${theme.text}`}>// Execution_Log</h3>
             
             <div className={`space-y-6 relative pl-4 border-l ${theme.border} ml-2`}>
                 {/* Item 1 */}
                 <div className="relative">
                     <span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${theme.bg} border-2 border-black`}></span>
                     <div className="flex justify-between items-baseline mb-1">
                         <span className="font-bold text-white text-sm">Full Stack Intern</span>
                         <span className={`text-[10px] opacity-80 bg-black border ${theme.border} ${theme.text} px-1 rounded`}>Current</span>
                     </div>
                     <div className={`text-xs ${theme.text} font-bold mb-1 opacity-80`}>Infinitraq</div>
                     <p className="text-xs text-zinc-400 leading-relaxed">
                         Frontend & Backend layers. Improving reliability and data flow using Node.js/Express.
                     </p>
                 </div>

                 {/* Item 2 */}
                 <div className="relative">
                     <span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-zinc-700 border-2 border-black`}></span>
                     <div className="flex justify-between items-baseline mb-1">
                         <span className="font-bold text-white text-sm">Technical Team</span>
                         <span className={`text-[10px] opacity-60 bg-white/5 border border-white/10 px-1 rounded text-zinc-400`}>202X</span>
                     </div>
                     <div className={`text-xs ${theme.text} font-bold mb-1 opacity-80`}>ACM Student Chapter</div>
                     <p className="text-xs text-zinc-400 leading-relaxed">
                         Collaborating on tech initiatives and peer workshops.
                     </p>
                 </div>
             </div>
          </div>
      </div>
      
      {/* Footer Status */}
      <div className="bg-black/40 p-3 text-[10px] font-mono border-t border-white/5 flex justify-between items-center text-zinc-500">
          <span className="opacity-50 tracking-widest uppercase">ID: GK-2024-X</span>
          <div className="flex gap-2 items-center">
              <span className="opacity-50">View details:</span>
              <span className={`${theme.text} bg-black/50 px-2 py-1 rounded border ${theme.border} border-opacity-30`}>
                  $ cat about.txt
              </span>
          </div>
      </div>
    </div>
  );
};

export default UserProfile;
