import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SubNavigationLayout({ children, header }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans selection:bg-[#CCFF00] selection:text-black">
            {/* Sidebar - Brutalist */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-out border-r border-[#27272a] bg-[#09090b] flex flex-col shrink-0`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272a]">
                    {isSidebarOpen && <span className="font-bold tracking-tighter text-[#CCFF00] uppercase pt-1">FlipForge Cost</span>}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-[#27272a] rounded-none text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
                    <Link href="/dashboard" className="px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 hover:text-white hover:bg-[#27272a] transition-all">
                        {isSidebarOpen ? 'DASHBOARD' : 'DB'}
                    </Link>
                    <Link href="/quotes/create" className="px-3 py-2 text-sm font-medium tracking-wide text-[#09090b] bg-[#CCFF00] hover:bg-[#b3e600] transition-all">
                        {isSidebarOpen ? 'NOVO ORÇAMENTO' : '+'}
                    </Link>
                    <Link href="/quotes" className="px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 hover:text-white hover:bg-[#27272a] transition-all">
                        {isSidebarOpen ? 'ARQUIVOS' : 'AR'}
                    </Link>
                    <Link href="/filaments" className="px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 hover:text-white hover:bg-[#27272a] transition-all">
                        {isSidebarOpen ? 'FILAMENTOS' : 'FL'}
                    </Link>
                    <Link href="/consumables" className="px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 hover:text-white hover:bg-[#27272a] transition-all">
                        {isSidebarOpen ? 'INSUMOS' : 'IN'}
                    </Link>
                    <Link href="/clients" className="px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 hover:text-white hover:bg-[#27272a] transition-all">
                        {isSidebarOpen ? 'CLIENTES' : 'CL'}
                    </Link>
                    <Link href="/settings" className="px-3 py-2 text-sm font-medium tracking-wide text-zinc-400 hover:text-white hover:bg-[#27272a] transition-all">
                        {isSidebarOpen ? 'PARÂMETROS' : 'PR'}
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between px-8 shrink-0">
                    <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                        {header || 'WORKSPACE'}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm border border-[#27272a] px-3 py-1 font-mono">{auth.user.name}</span>
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-red-500 hover:text-red-400 uppercase tracking-wide">
                            Sair
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[#09090b]">
                    {children}
                </main>
            </div>
        </div>
    );
}
