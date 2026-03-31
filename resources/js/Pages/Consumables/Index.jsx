import { Head, useForm, router } from '@inertiajs/react';
import SubNavigationLayout from '@/Layouts/SubNavigationLayout';

export default function Index({ consumables }) {
    const { data, setData, post, processing, reset, errors, transform } = useForm({
        name: '',
        total_price: 0,
        quantity: 1,
        unit: 'un',
        purchase_date: '',
    });

    transform((data) => ({
        ...data,
        purchase_date: data.purchase_date || null,
    }));

    const submit = (e) => {
        e.preventDefault();
        post(route('consumables.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if(confirm('Tem certeza que deseja apagar este insumo? Orçamentos passados não sofrerão alteração.')) {
            router.delete(route('consumables.destroy', id));
        }
    };

    return (
        <SubNavigationLayout header="ESTOQUE DE INSUMOS MISTOS">
            <Head title="Insumos e Extras" />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Lado Esquerdo - Formulário Brutalista */}
                <div className="w-full lg:w-1/3 xl:w-1/4 border border-[#27272a] bg-[#0f0f11] p-6 sticky top-8">
                    <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-6 border-b border-[#27272a] pb-2 uppercase">NOVO INSUMO / EXTRA</h2>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Nome (Ex: Embalagem / Tinta)</label>
                            <input type="text" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Unidade/Tipo (Ex: un, L)</label>
                                <input type="text" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono uppercase"
                                    value={data.unit} onChange={e => setData('unit', e.target.value)} required maxLength="10" />
                                {errors.unit && <div className="text-red-500 text-xs mt-1">{errors.unit}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Qtd. Comprada</label>
                                <input type="number" step="0.01" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.quantity} onChange={e => setData('quantity', e.target.value)} required min="0.01" />
                                {errors.quantity && <div className="text-red-500 text-xs mt-1">{errors.quantity}</div>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Preço Total Pago (R$)</label>
                                <input type="number" step="0.01" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.total_price} onChange={e => setData('total_price', e.target.value)} required min="0" />
                                {errors.total_price && <div className="text-red-500 text-xs mt-1">{errors.total_price}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Data Compra</label>
                                <input type="date" className="w-full bg-[#09090b] border border-[#27272a] text-zinc-300 p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} />
                                {errors.purchase_date && <div className="text-red-500 text-xs mt-1">{errors.purchase_date}</div>}
                            </div>
                        </div>

                        <button disabled={processing} type="submit" className="w-full mt-4 bg-[#CCFF00] text-black font-bold uppercase tracking-widest py-3 hover:bg-[#b3e600] transition-colors border-none rounded-none disabled:opacity-50">
                            CADASTRAR INSUMO
                        </button>
                    </form>
                </div>

                {/* Lado Direito - Tabela Densamente Funcional */}
                <div className="w-full lg:w-2/3 xl:w-3/4 border border-[#27272a] bg-[#09090b]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="bg-[#0f0f11] text-zinc-400 text-xs border-b border-[#27272a]">
                                <tr>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">Identificação</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Data Compra</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Massa/Qtd Comprada</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Preço Total</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-[#CCFF00] text-right">Custo / Unid.</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#27272a]">
                                {consumables.length === 0 ? (
                                    <tr><td colSpan="6" className="py-12 text-center text-zinc-500 italic">Estoque de insumos extras vazio.</td></tr>
                                ) : consumables.map(c => (
                                    <tr key={c.id} className="hover:bg-[#18181b] transition-colors">
                                        <td className="py-4 px-6 text-white text-sm">{c.name}</td>
                                        <td className="py-4 px-6 text-zinc-400 text-xs text-right">
                                            {c.purchase_date ? new Date(c.purchase_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-400 text-right">{parseFloat(c.quantity).toFixed(2)} <span className="uppercase text-xs">{c.unit}</span></td>
                                        <td className="py-4 px-6 text-zinc-400 text-right">R$ {parseFloat(c.total_price || 0).toFixed(2)}</td>
                                        <td className="py-4 px-6 font-bold text-[#CCFF00] text-right">R$ {parseFloat(c.cost).toFixed(4)} <span className="text-xs uppercase font-normal opacity-70">/ {c.unit}</span></td>
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
        </SubNavigationLayout>
    );
}
