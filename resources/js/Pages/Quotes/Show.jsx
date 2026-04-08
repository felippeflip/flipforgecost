import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ quote }) {
    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
        approved: 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]',
        production: 'bg-blue-500/20 text-blue-500 border-blue-500',
        completed: 'bg-zinc-500/20 text-zinc-400 border-zinc-500',
        rejected: 'bg-red-500/20 text-red-500 border-red-500'
    };
    
    const statusLabels = {
        pending: 'Pendente',
        approved: 'Aprovado',
        production: 'Produção',
        completed: 'Concluído',
        rejected: 'Rejeitado'
    };

    return (
        <AppLayout header={`ORÇAMENTO: ${quote.project_name}`}>
            <Head title={`Orçamento #${quote.formatted_id}`} />

            <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">
                {/* Left Side: Detail */}
                <div className="w-full lg:w-2/3 border border-[#27272a] bg-[#09090b] p-6 sm:p-12 mb-8">
                    <div className="flex justify-between items-start border-b border-[#27272a] pb-6 mb-8">
                        <div>
                            <div className="flex gap-4 items-center mb-2">
                                <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">{quote.project_name}</h1>
                                <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold border ${statusColors[quote.status]} rounded-sm`}>
                                    {statusLabels[quote.status]}
                                </span>
                            </div>
                            <p className="text-zinc-500 font-mono text-sm mt-1">ID: #{quote.formatted_id} <span className="opacity-50 text-[10px]">({quote.uuid})</span></p>
                            <p className="text-zinc-400 font-mono text-sm mt-1">Data: {new Date(quote.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-[#CCFF00] font-mono font-bold tracking-widest text-sm uppercase mb-1">Cliente</h2>
                            <p className="text-white text-lg">{quote.client ? quote.client.name : 'Avulso'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="border border-[#27272a] p-4 bg-[#0f0f11]">
                            <span className="block text-xs font-mono text-zinc-500 uppercase mb-2">Tempo Máq.</span>
                            <span className="text-white font-mono text-xl">{Math.floor(quote.print_time_minutes / 60)}h {Math.floor(quote.print_time_minutes % 60)}m</span>
                        </div>
                        <div className="border border-[#27272a] p-4 bg-[#0f0f11]">
                            <span className="block text-xs font-mono text-zinc-500 uppercase mb-2">Tempo Man.</span>
                            <span className="text-white font-mono text-xl">{Math.floor(quote.manual_time_minutes / 60)}h {Math.floor(quote.manual_time_minutes % 60)}m</span>
                        </div>
                        <div className="border border-[#27272a] p-4 bg-[#0f0f11]">
                            <span className="block text-xs font-mono text-zinc-500 uppercase mb-2">Falha Estimada</span>
                            <span className="text-white font-mono text-xl">{quote.snap_failure_rate_percent}%</span>
                        </div>
                        <div className="border border-[#27272a] p-4 bg-[#0f0f11]">
                            <span className="block text-xs font-mono text-zinc-500 uppercase mb-2">Margem Lucro</span>
                            <span className="text-white font-mono text-xl">{quote.snap_profit_margin_percent}%</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-4 border-b border-[#27272a] pb-2">MATERIAIS UTILIZADOS (SNAPSHOT PREÇOS)</h3>
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="text-zinc-500 text-xs">
                                <tr>
                                    <th className="py-2">Item</th>
                                    <th className="py-2 text-right">Qtd</th>
                                    <th className="py-2 text-right">Custo Injetado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#27272a]">
                                {quote.filaments.map(f => (
                                    <tr key={`f-${f.id}`}>
                                        <td className="py-3 text-white">{f.color} - {f.brand} <span className="text-xs text-zinc-500">[{f.type}]</span></td>
                                        <td className="py-3 text-zinc-400 text-right">{f.pivot.weight_g} g</td>
                                        <td className="py-3 text-zinc-400 text-right">R$ {parseFloat(f.pivot.price_per_gram_at_the_time * f.pivot.weight_g).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {quote.consumables.map(c => (
                                    <tr key={`c-${c.id}`}>
                                        <td className="py-3 text-white">{c.name}</td>
                                        <td className="py-3 text-zinc-400 text-right">{parseFloat(c.pivot.quantity).toFixed(2)} {c.unit}</td>
                                        <td className="py-3 text-zinc-400 text-right">R$ {parseFloat(c.pivot.cost_at_the_time * c.pivot.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side: Total */}
                <div className="w-full lg:w-1/3 sticky top-8">
                    <div className="border border-[#27272a] bg-[#CCFF00] text-black p-6 shadow-[8px_8px_0px_#000]">
                        <h3 className="font-mono font-bold tracking-tighter text-xl mb-6 border-b border-black/20 pb-2">TOTAL FINAL</h3>
                        <div className="pt-2 flex flex-col items-center">
                            <span className="text-5xl font-bold tracking-tighter">R$ {parseFloat(quote.final_price).toFixed(2)}</span>
                        </div>

                        {quote.items_per_print > 1 && (
                            <div className="flex justify-between text-[#ff3366] font-bold mt-4 pt-4 pb-2 border-t border-black/20 border-b border-black/10 text-sm">
                                <span>VALOR POR UNIDADE ({quote.items_per_print}x)</span>
                                <span>R$ {(parseFloat(quote.final_price) / quote.items_per_print).toFixed(2)}</span>
                            </div>
                        )}

                        {quote.sale_type === 'consignment' && (
                            <div className="mt-4 bg-black/10 p-4 rounded-sm text-sm">
                                <div className="font-bold mb-2 uppercase text-center text-xs tracking-widest text-[#ff3366]">Simulador Consignação</div>
                                <div className="flex justify-between mb-1">
                                    <span>Você Irá Receber:</span>
                                    <span className="font-bold">R$ {parseFloat(quote.final_price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-1 text-xs text-black/70">
                                    <span>Taxa Loja ({quote.consignment_percent}%):</span>
                                    <span className="text-red-600 font-bold">
                                        R$ {((parseFloat(quote.final_price) / (1 - (quote.consignment_percent / 100))) - parseFloat(quote.final_price)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold border-t border-black/20 pt-2 mt-2">
                                    <span>SUGESTÃO VENDA Lj:</span>
                                    <span className="text-lg">R$ {(parseFloat(quote.final_price) / (1 - (quote.consignment_percent / 100))).toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                        <div className="mt-8">
                            <Link href={`/quotes/${quote.id}/edit`} className="block text-center w-full bg-[#18181b] text-zinc-300 font-bold uppercase tracking-widest py-4 hover:bg-zinc-800 transition-colors border-none rounded-none border border-zinc-700 mb-2">
                                EDITAR / MUDAR STATUS
                            </Link>

                            <button onClick={() => window.print()} className="w-full bg-[#CCFF00] text-black font-bold uppercase tracking-widest py-4 hover:bg-[#b3e600] transition-colors border-none rounded-none">
                                COMPROVANTE / PDF
                            </button>
                            <Link href="/quotes" className="block text-center w-full bg-transparent text-zinc-500 border-2 border-[#27272a] font-bold uppercase tracking-widest py-3 mt-4 hover:border-zinc-500 hover:text-white transition-colors rounded-none">
                                VOLTAR AO ARQUIVO
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
