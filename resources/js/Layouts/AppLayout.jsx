import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const SidebarItem = ({ href, label, shortLabel, icon, active, isOpen, isSpecial = false }) => {
    const baseClasses = "px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200 border-l-2";
    const activeClasses = active 
        ? "text-white bg-[#27272a] border-[#CCFF00]" 
        : "text-zinc-400 border-transparent hover:text-white hover:bg-[#18181b] hover:border-zinc-700";
    const specialClasses = isSpecial 
        ? "text-[#09090b] bg-[#CCFF00] hover:bg-[#b3e600] border-none" 
        : "";

    return (
        <Link 
            href={href} 
            className={`${baseClasses} ${isSpecial ? specialClasses : activeClasses}`}
        >
            {isOpen ? label : shortLabel}
        </Link>
    );
};

export default function AppLayout({ children, header }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans selection:bg-[#CCFF00] selection:text-black">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-out border-r border-[#27272a] bg-[#09090b] flex flex-col shrink-0`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-[#27272a]">
                    {isSidebarOpen && (
                        <span className="font-bold tracking-tighter text-[#CCFF00] uppercase pt-1">
                            FlipForge <span className="text-white">Cost</span>
                        </span>
                    )}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-[#27272a] text-zinc-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-2">
                    <SidebarItem 
                        href={route('dashboard')} 
                        label="DASHBOARD" 
                        shortLabel="DB" 
                        active={route().current('dashboard')} 
                        isOpen={isSidebarOpen} 
                    />
                    <SidebarItem 
                        href="/quotes/create" 
                        label="NOVO ORÇAMENTO" 
                        shortLabel="+" 
                        isOpen={isSidebarOpen} 
                        isSpecial={true} 
                    />
                    <SidebarItem 
                        href="/quotes" 
                        label="ARQUIVOS" 
                        shortLabel="AR" 
                        active={route().current('quotes.*')} 
                        isOpen={isSidebarOpen} 
                    />
                    <SidebarItem 
                        href="/filaments" 
                        label="FILAMENTOS" 
                        shortLabel="FL" 
                        active={route().current('filaments.*')} 
                        isOpen={isSidebarOpen} 
                    />
                    <SidebarItem 
                        href="/consumables" 
                        label="INSUMOS" 
                        shortLabel="IN" 
                        active={route().current('consumables.*')} 
                        isOpen={isSidebarOpen} 
                    />
                    <SidebarItem 
                        href="/clients" 
                        label="CLIENTES" 
                        shortLabel="CL" 
                        active={route().current('clients.*')} 
                        isOpen={isSidebarOpen} 
                    />
                    <SidebarItem 
                        href="/settings" 
                        label="PARÂMETROS" 
                        shortLabel="PR" 
                        active={route().current('settings.*')} 
                        isOpen={isSidebarOpen} 
                    />

                    {auth.is_admin && (
                        <div className="mt-8 pt-4 border-t border-[#27272a]">
                            <SidebarItem 
                                href={route('admin.users.index')} 
                                label="PAINEL ADM" 
                                shortLabel="ADM" 
                                active={route().current('admin.users.*')} 
                                isOpen={isSidebarOpen} 
                                isSpecial={false}
                            />
                        </div>
                    )}
                </nav>

                {/* User Context Footer */}
                <div className="p-4 border-t border-[#27272a] bg-[#0f0f11]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#CCFF00]">
                            {auth.user.name.charAt(0)}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold truncate text-white uppercase">{auth.user.name}</span>
                                <span className="text-[10px] font-mono text-zinc-500 truncate">{auth.is_admin ? 'SUPER ADMIN' : 'USER'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="h-16 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between px-8 shrink-0">
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                        {header || 'WORKSPACE // 00'}
                    </div>
                    <div className="flex items-center gap-6">
                        <Link 
                            href={route('profile.edit')} 
                            className="text-xs font-bold text-zinc-400 hover:text-[#CCFF00] transition-colors uppercase tracking-widest"
                        >
                            Configurações
                        </Link>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest border border-red-500/20 px-3 py-1 hover:bg-red-500/10 transition-all"
                        >
                            Deslogar_
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[#09090b]">
                    <div className="animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
