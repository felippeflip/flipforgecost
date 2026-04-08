import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500 selection:text-black font-sans">
            <Head>
                <title>FlipForge Cost | Orçamentos 3D de Alta Precisão</title>
                <meta name="description" content="A ferramenta definitiva para profissionais de impressão 3D. Gere orçamentos precisos, gerencie filamentos e encante seus clientes em segundos." />
                
                {/* SEO Keywords */}
                <meta name="keywords" content="impressão 3d, orçamento 3d, gerador de custos 3d, filamento, sla, fdm, gestão 3d, flipforge" />
                
                {/* OpenGraph */}
                <meta property="og:title" content="FlipForge Cost | Orçamentos 3D de Alta Precisão" />
                <meta property="og:description" content="Transforme arquivos STL em lucro. O sistema mais completo para precificação de impressão 3D." />
                <meta property="og:image" content="/3d_printer_hero_1775609379853.png" />
                <meta property="og:type" content="website" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="FlipForge Cost | Orçamentos 3D de Alta Precisão" />
                <meta name="twitter:description" content="Gere orçamentos de impressão 3D profissionais em segundos." />
            </Head>

            {/* Navigation */}
            <nav className={`fixed top-0 z-50 w-full px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <span className="text-xl font-bold italic">F</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter sm:block hidden">FLIPFORGE<span className="text-orange-500">COST</span></span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-orange-500 hover:text-white"
                            >
                                Painel de Controle
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-400 transition hover:text-white md:px-4"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-orange-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 shadow-lg shadow-orange-600/20"
                                >
                                    Começar Grátis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
                {/* Background Glows */}
                <div className="absolute left-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]"></div>
                <div className="absolute right-1/4 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-amber-600/10 blur-[100px]"></div>

                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
                            </span>
                            Novo: Orçamento via Inteligência Artificial
                        </div>
                        
                        <h1 className="text-5xl font-black leading-tight sm:text-7xl">
                            Domine seus <br />
                            Custos de <span className="bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">Impressão 3D</span>
                        </h1>
                        
                        <p className="mx-auto max-w-xl text-lg text-gray-400 lg:mx-0">
                            Pare de perder dinheiro com estimativas erradas. O FlipForge Cost calcula automaticamente o custo de material, eletricidade, desgaste e mão de obra para que você lucre em cada peça.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href={route('register')}
                                className="group relative flex items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-lg font-bold transition hover:bg-orange-500 overflow-hidden"
                            >
                                <span className="relative z-10 text-white">Criar Orçamento Agora</span>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-400 to-amber-600 opacity-0 transition group-hover:opacity-100"></div>
                            </Link>
                            <Link
                                href="#como-funciona"
                                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold transition hover:bg-white/10"
                            >
                                Ver Demonstração
                            </Link>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 grayscale opacity-50">
                            <div className="text-xs uppercase tracking-widest text-gray-500 flex flex-col gap-1">
                                <span>Confiado por +500</span>
                                <span>Impressoras no Brasil</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-orange-500/20 to-transparent blur-2xl"></div>
                        <img 
                            src="/3d_printer_hero_1775609379853.png" 
                            alt="3D Printer Visualization" 
                            className="relative h-auto w-full max-w-xl mx-auto rounded-[2rem] border border-white/10 shadow-2xl"
                        />
                        
                        {/* Floating Stats */}
                        <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl animate-bounce duration-[4000ms]">
                            <div className="text-2xl font-black text-orange-500">R$ 12.450</div>
                            <div className="text-[10px] uppercase text-gray-400 tracking-wider">Economia média/ano</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section id="features" className="py-24 px-6 border-t border-white/5">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl font-bold">Por que o FlipForge Cost?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto italic">"O segredo para transformar um hobby em um negócio lucrativo é a precisão dos dados."</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Cálculos de Precisão Cirúrgica',
                                desc: 'Considere cada grama de filamento, horas de eletricidade e o custo real da sua hora de trabalho.',
                                icon: '🎯'
                            },
                            {
                                title: 'Gestão de Materiais',
                                desc: 'Catálogo de filamentos com preços atualizados e controle de estoque simplificado.',
                                icon: '📦'
                            },
                            {
                                title: 'PDFs Profissionais',
                                desc: 'Envie orçamentos personalizados com sua logo e encante seus clientes logo no primeiro contato.',
                                icon: '📄'
                            }
                        ].map((f, i) => (
                            <div key={i} className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition hover:border-orange-500/30 hover:bg-white/[0.05]">
                                <div className="mb-6 text-4xl">{f.icon}</div>
                                <h3 className="mb-3 text-xl font-bold">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scarcity/Mental Trigger */}
            <section className="bg-orange-600 py-16">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-black text-white">Pronto para profissionalizar sua oficina?</h2>
                        <p className="text-orange-100">O cadastro grátis é por tempo limitado. Os primeiros 100 usuários recebem o módulo Premium.</p>
                    </div>
                    <Link
                        href={route('register')}
                        className="rounded-full bg-white px-10 py-4 text-lg font-bold text-orange-600 transition hover:scale-105 active:scale-95 shadow-xl"
                    >
                        Garantir Minha Vaga
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-black">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 grayscale brightness-200">
                        <div className="h-6 w-6 rounded bg-orange-500 flex items-center justify-center">
                            <span className="text-xs font-bold italic">F</span>
                        </div>
                        <span className="text-sm font-bold tracking-tighter">FLIPFORGE<span className="text-orange-500">COST</span></span>
                    </div>
                    <div className="text-gray-500 text-xs text-center">
                        © 2026 FlipForge Cost. Todos os direitos reservados. <br className="md:hidden" />
                        Desenvolvido para makers por makers.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Suporte</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
