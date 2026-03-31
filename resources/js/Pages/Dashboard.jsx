import { Head, Link } from '@inertiajs/react';
import SubNavigationLayout from '@/Layouts/SubNavigationLayout';

export default function Dashboard({ stats, recent_quotes, top_clients }) {
    
    // Aesthetic helper
    const statusColors = {
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
        approved: 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]',
        production: 'bg-blue-500/10 text-blue-500 border-blue-500',
        completed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500',
        rejected: 'bg-red-500/10 text-red-500 border-red-500'
    };

    const statusLabels = {
        pending: 'PENDENTE',
        approved: 'APROVADO',
        production: 'PRODUÇÃO',
        completed: 'CONCLUÍDO',
        rejected: 'REJEITADO'
    };

    return (
        <SubNavigationLayout header="CENTRAL DE COMANDO">
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="border border-[#27272a] bg-[#0f0f11] p-6 shadow-[4px_4px_0px_#CCFF00]">
                        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Total Aprovado</h3>
                        <p className="text-3xl font-bold tracking-tighter text-[#CCFF00]">R$ {parseFloat(stats.approved_amount || 0).toFixed(2)}</p>
                    </div>
                    <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Negócios Pendentes</h3>
                        <p className="text-3xl font-bold tracking-tighter text-yellow-500">R$ {parseFloat(stats.pending_amount || 0).toFixed(2)}</p>
                        <p className="font-mono text-xs text-zinc-400 mt-2">({stats.pending_count} aguardando retorno)</p>
                    </div>
                    <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Volume Total de Cotações</h3>
                        <p className="text-3xl font-bold tracking-tighter text-white">{stats.total_quotes}</p>
                    </div>
                    <div className="border border-[#27272a] bg-[#0f0f11] p-6 flex flex-col justify-center gap-2">
                        <Link href="/quotes/create" className="text-center w-full bg-[#CCFF00] text-black font-bold uppercase tracking-widest py-3 hover:bg-[#b3e600] transition-colors border-none rounded-none block">
                            + NOVO ORÇAMENTO
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Quotes */}
                    <div className="lg:col-span-2 border border-[#27272a] bg-[#09090b]">
                        <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#0f0f11]">
                            <h2 className="text-sm font-mono tracking-widest text-[#CCFF00] uppercase">Mesa Operacional (Recentes)</h2>
                            <Link href="/quotes" className="text-xs font-mono text-zinc-500 hover:text-white uppercase transition-colors">Ver Tudo →</Link>
                        </div>
                        <div className="p-0">
                            {recent_quotes.length === 0 ? (
                                <div className="p-12 text-center text-zinc-500 font-mono text-sm italic">
                                    A mesa está vazia. Gere o primeiro orçamento.
                                </div>
                            ) : (
                                <table className="w-full text-left font-mono text-sm">
                                    <tbody className="divide-y divide-[#27272a]">
                                        {recent_quotes.map(q => (
                                            <tr key={q.id} className="hover:bg-[#18181b] transition-colors">
                                                <td className="py-4 px-6 text-white text-sm">
                                                    <span className="font-bold">#{q.formatted_id} - {q.project_name}</span><br/>
                                                    <span className="text-zinc-500 text-xs">{q.client ? q.client.name : 'Avulso'}</span>
                                                </td>
                                                <td className="py-4 px-6 text-white text-xs">
                                                    <span className={`px-2 py-1 uppercase tracking-widest font-bold border ${statusColors[q.status]} rounded-sm`}>
                                                        {statusLabels[q.status]}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-bold text-white text-right">R$ {parseFloat(q.final_price).toFixed(2)}</td>
                                                <td className="py-4 px-6 text-right">
                                                    <Link href={`/quotes/${q.id}`} className="text-zinc-400 hover:text-white uppercase text-xs tracking-wider border border-[#27272a] px-3 py-1 font-bold">
                                                        Abrir
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="border border-[#27272a] bg-[#09090b] flex flex-col">
                        <div className="p-4 border-b border-[#27272a] bg-[#0f0f11]">
                            <h2 className="text-sm font-mono tracking-widest text-[#CCFF00] uppercase">Melhores Clientes (Aprovado)</h2>
                        </div>
                        <div className="flex-1 p-6 flex flex-col gap-4">
                            {top_clients.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-sm italic text-center">
                                    Nenhum faturamento registrado ainda.
                                </div>
                            ) : top_clients.map((tc, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-[#27272a] pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <div className="text-white font-bold text-sm">{tc.name}</div>
                                        <div className="text-zinc-500 text-xs font-mono mt-1">{tc.approved_count} Vendas(s) Fechadas</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[#CCFF00] font-bold font-mono text-sm">R$ {tc.total_approved.toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SubNavigationLayout>
    );
}
