export type Theme = {
    name: string;
    text: string;
    textDim: string;
    textBold: string;
    border: string;
    glow: string;
    bg: string; // For selection/highlights
    buttonClose: string;
    buttonMin: string;
    buttonMax: string;
    hex: string;
};

export const THEMES: { [key: string]: Theme } = {
    matrix: {
        name: 'matrix',
        text: 'text-green-500',
        textDim: 'text-blue-400',
        textBold: 'text-green-400',
        border: 'border-green-500/30',
        glow: 'shadow-[0_0_50px_rgba(0,255,0,0.2)]',
        bg: 'bg-green-500',
        buttonClose: 'bg-red-500',
        buttonMin: 'bg-yellow-500',
        buttonMax: 'bg-green-500',
        hex: '#00ff00',
    },
    cyberpunk: {
        name: 'cyberpunk',
        text: 'text-cyan-400',
        textDim: 'text-pink-400',
        textBold: 'text-yellow-400',
        border: 'border-cyan-500/30',
        glow: 'shadow-[0_0_50px_rgba(0,255,255,0.2)]',
        bg: 'bg-cyan-500',
        buttonClose: 'bg-pink-600',
        buttonMin: 'bg-yellow-400',
        buttonMax: 'bg-cyan-400',
        hex: '#00ffff',
    },
    amber: {
        name: 'amber',
        text: 'text-amber-500',
        textDim: 'text-amber-700',
        textBold: 'text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_50px_rgba(255,191,0,0.2)]',
        bg: 'bg-amber-500',
        buttonClose: 'bg-red-600',
        buttonMin: 'bg-amber-600',
        buttonMax: 'bg-orange-500',
        hex: '#ffbf00',
    },
    dracula: {
        name: 'dracula',
        text: 'text-purple-400',
        textDim: 'text-slate-400',
        textBold: 'text-pink-400',
        border: 'border-purple-500/30',
        glow: 'shadow-[0_0_50px_rgba(189,147,249,0.2)]',
        bg: 'bg-purple-500',
        buttonClose: 'bg-red-500',
        buttonMin: 'bg-yellow-500',
        buttonMax: 'bg-green-500',
        hex: '#bd93f9',
    }
};
