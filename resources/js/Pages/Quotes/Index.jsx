import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ quotes }) {
    return (
        <AppLayout header="ARQUIVO DE ORÇAMENTOS">
             <Head title="Orçamentos" />
             <div className="border border-[#27272a] bg-[#09090b] w-full mt-8">
                  <table className="w-full text-left font-mono text-sm">
                      <thead className="bg-[#0f0f11] text-zinc-400 text-xs border-b border-[#27272a]">
                          <tr>
                              <th className="py-4 px-6 font-medium uppercase tracking-wider">ID / Projeto</th>
                              <th className="py-4 px-6 font-medium uppercase tracking-wider">Status CRM</th>
                              <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Tempo Máq.</th>
                              <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Preço Final</th>
                              <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Ação</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272a]">
                          {quotes.length === 0 ? (
                              <tr><td colSpan="5" className="py-12 text-center text-zinc-500 italic">Nenhum orçamento gerado na sua conta.</td></tr>
                          ) : quotes.map(q => (
                              <tr key={q.id} className="hover:bg-[#18181b] transition-colors">
                                  <td className="py-4 px-6 text-white text-sm">
                                      <span className="font-bold">#{q.formatted_id} - {q.project_name}</span><br/>
                                      <span className="text-zinc-500 text-xs">{new Date(q.created_at).toLocaleDateString('pt-BR')}</span>
                                  </td>
                                  <td className="py-4 px-6 text-white text-xs">
                                        <span className={`px-2 py-1 uppercase tracking-widest font-bold border ${q.status === 'approved' ? 'border-[#CCFF00] text-[#CCFF00]' : (q.status === 'pending' ? 'border-yellow-500 text-yellow-500' : 'border-zinc-500 text-zinc-500')} rounded-sm`}>
                                            {q.status === 'approved' ? 'APROVADO' : (q.status === 'pending' ? 'PENDENTE' : q.status)}
                                        </span>
                                  </td>
                                  <td className="py-4 px-6 text-zinc-400 text-right">{Math.floor(q.print_time_minutes / 60)}h {Math.floor(q.print_time_minutes % 60)}m</td>
                                  <td className="py-4 px-6 font-bold text-[#CCFF00] text-right">R$ {parseFloat(q.final_price).toFixed(2)}</td>
                                  <td className="py-4 px-6 text-right">
                                      <Link href={route('quotes.show', q.id)} className="text-[#CCFF00] hover:text-[#b3e600] uppercase text-xs tracking-wider border border-[#CCFF00]/30 px-3 py-1 font-bold">
                                          ABRIR
                                      </Link>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
             </div>
        </AppLayout>
    );
}
