import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ clients }) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if(confirm('Apagar cliente? O histórico nos orçamentos já gerados será mantido em texto, mas a associação será perdida.')) {
            router.delete(route('clients.destroy', id));
        }
    };

    return (
        <AppLayout header="BASE DE CLIENTES">
            <Head title="Clientes" />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Formulário Brutalista */}
                <div className="w-full lg:w-1/3 xl:w-1/4 border border-[#27272a] bg-[#0f0f11] p-6 sticky top-8">
                    <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-6 border-b border-[#27272a] pb-2 uppercase">NOVO CLIENTE</h2>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Nome / Empresa</label>
                            <input type="text" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                value={data.name} onChange={e => setData('name', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">E-mail</label>
                            <input type="email" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                value={data.email} onChange={e => setData('email', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">WhatsApp / Telefone</label>
                            <input type="text" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                value={data.phone} onChange={e => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Endereço (Opcional)</label>
                            <textarea className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono h-24"
                                value={data.address} onChange={e => setData('address', e.target.value)} />
                        </div>

                        <button disabled={processing} type="submit" className="w-full mt-4 bg-[#CCFF00] text-black font-bold uppercase tracking-widest py-3 hover:bg-[#b3e600] transition-colors border-none rounded-none disabled:opacity-50">
                            CADASTRAR
                        </button>
                    </form>
                </div>

                {/* Tabela Densamente Funcional */}
                <div className="w-full lg:w-2/3 xl:w-3/4 border border-[#27272a] bg-[#09090b]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="bg-[#0f0f11] text-zinc-400 text-xs border-b border-[#27272a]">
                                <tr>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">Cód.</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">Identificação</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">Contato</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#27272a]">
                                {clients.length === 0 ? (
                                    <tr><td colSpan="4" className="py-12 text-center text-zinc-500 italic">Lista de clientes vazia.</td></tr>
                                ) : clients.map(c => (
                                    <tr key={c.id} className="hover:bg-[#18181b] transition-colors">
                                        <td className="py-4 px-6 text-zinc-500">#{c.id}</td>
                                        <td className="py-4 px-6 text-white font-bold">{c.name}</td>
                                        <td className="py-4 px-6 text-zinc-400">
                                            {c.email && <span className="block">{c.email}</span>}
                                            {c.phone && <span className="block text-xs text-zinc-500">{c.phone}</span>}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-400 uppercase text-xs tracking-wider border border-red-900 px-2 py-1">
                                                DEL
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
