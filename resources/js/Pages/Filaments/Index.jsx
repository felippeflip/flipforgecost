import { Head, useForm, router } from '@inertiajs/react';
import SubNavigationLayout from '@/Layouts/SubNavigationLayout';

export default function Index({ filaments }) {
    const { data, setData, post, processing, reset, errors, transform } = useForm({
        brand: '',
        color: '',
        type: 'PLA',
        quality: '',
        purchase_date: '',
        initial_weight_g: 1000,
        total_price: 0,
    });

    transform((data) => ({
        ...data,
        purchase_date: data.purchase_date || null,
        quality: data.quality || null,
    }));

    const submit = (e) => {
        e.preventDefault();
        post(route('filaments.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if(confirm('Tem certeza que deseja apagar? Este filamento não poderá mais ser selecionado, mas orçamentos passados não serão alterados.')) {
            router.delete(route('filaments.destroy', id));
        }
    };

    return (
        <SubNavigationLayout header="ESTOQUE DE FILAMENTOS">
            <Head title="Filamentos" />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Lado Esquerdo - Formulário Brutalista */}
                <div className="w-full lg:w-1/3 xl:w-1/4 border border-[#27272a] bg-[#0f0f11] p-6 sticky top-8">
                    <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-6 border-b border-[#27272a] pb-2 uppercase">NOVO ROLO DE FILAMENTO</h2>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Marca / Fabricante</label>
                            <input type="text" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                value={data.brand} onChange={e => setData('brand', e.target.value)} required placeholder="Ex: Sunlu" />
                            {errors.brand && <div className="text-red-500 text-xs mt-1">{errors.brand}</div>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Material</label>
                                <select className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.type} onChange={e => setData('type', e.target.value)} required>
                                    <option value="PLA">PLA</option>
                                    <option value="PETG">PETG</option>
                                    <option value="ABS">ABS</option>
                                    <option value="TPU">TPU</option>
                                    <option value="ASA">ASA</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Cor Dominante</label>
                                <input type="text" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.color} onChange={e => setData('color', e.target.value)} required />
                                {errors.color && <div className="text-red-500 text-xs mt-1">{errors.color}</div>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Acabamento</label>
                                <input type="text" placeholder="Velvet, HF..." className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.quality} onChange={e => setData('quality', e.target.value)} />
                                {errors.quality && <div className="text-red-500 text-xs mt-1">{errors.quality}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Data Lote</label>
                                <input type="date" className="w-full bg-[#09090b] border border-[#27272a] text-zinc-300 p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} />
                                {errors.purchase_date && <div className="text-red-500 text-xs mt-1">{errors.purchase_date}</div>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Peso Atual (g)</label>
                                <input type="number" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.initial_weight_g} onChange={e => setData('initial_weight_g', e.target.value)} required min="1" />
                                {errors.initial_weight_g && <div className="text-red-500 text-xs mt-1">{errors.initial_weight_g}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Preço Pago (R$)</label>
                                <input type="number" step="0.01" className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] font-mono"
                                    value={data.total_price} onChange={e => setData('total_price', e.target.value)} required min="0" />
                                {errors.total_price && <div className="text-red-500 text-xs mt-1">{errors.total_price}</div>}
                            </div>
                        </div>

                        <button disabled={processing} type="submit" className="w-full mt-4 bg-[#CCFF00] text-black font-bold uppercase tracking-widest py-3 hover:bg-[#b3e600] transition-colors border-none rounded-none disabled:opacity-50">
                            CADASTRAR ROLO
                        </button>
                    </form>
                </div>

                {/* Lado Direito - Tabela Densamente Funcional */}
                <div className="w-full lg:w-2/3 xl:w-3/4 border border-[#27272a] bg-[#09090b]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="bg-[#0f0f11] text-zinc-400 text-xs border-b border-[#27272a]">
                                <tr>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">SKU / Marca</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">Tipo/Cor</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider">Data Compra</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Massa (g)</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Rolo Custo</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-[#CCFF00] text-right">R$ / Grama</th>
                                    <th className="py-4 px-6 font-medium uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#27272a]">
                                {filaments.length === 0 ? (
                                    <tr><td colSpan="6" className="py-12 text-center text-zinc-500 italic">Nenhum filamento disponível no estoque.</td></tr>
                                ) : filaments.map(f => (
                                    <tr key={f.id} className="hover:bg-[#18181b] transition-colors">
                                        <td className="py-4 px-6 text-white text-sm">
                                            {f.brand}<br/>
                                            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">{f.quality || 'STANDARD'}</span>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-300">
                                            <span className="font-bold text-white pr-2">{f.type}</span>{f.color}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-400 text-xs">
                                            {f.purchase_date ? new Date(f.purchase_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-400 text-right">{f.initial_weight_g} g</td>
                                        <td className="py-4 px-6 text-zinc-400 text-right">R$ {parseFloat(f.total_price).toFixed(2)}</td>
                                        <td className="py-4 px-6 font-bold text-[#CCFF00] text-right">
                                            R$ {parseFloat(f.price_per_gram).toFixed(4)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-400 uppercase text-xs tracking-wider border border-red-900 px-2 py-1">
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
