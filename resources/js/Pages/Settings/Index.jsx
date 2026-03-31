import { Head, useForm } from '@inertiajs/react';
import SubNavigationLayout from '@/Layouts/SubNavigationLayout';

export default function Index({ settings }) {
    const { data, setData, post, processing } = useForm({
        energy_cost_kwh: settings?.energy_cost_kwh || 0,
        machine_depreciation_hour: settings?.machine_depreciation_hour || 0,
        man_hour_cost: settings?.man_hour_cost || 0,
        profit_margin_percent: settings?.profit_margin_percent || 0,
        failure_rate_percent: settings?.failure_rate_percent || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.store'));
    };

    return (
        <SubNavigationLayout header="PARÂMETROS GLOBAIS">
            <Head title="Parâmetros de Precificação" />

            <div className="max-w-4xl mx-auto border border-[#27272a] bg-[#0f0f11] p-8">
                <div className="mb-8 border-b border-[#27272a] pb-4">
                    <h1 className="text-2xl font-mono text-[#CCFF00] tracking-widest uppercase font-bold">Variáveis de Custos</h1>
                    <p className="font-mono text-zinc-500 text-sm mt-2">Defina os valores base que serão fixados em seus novos orçamentos. Alterações aqui não afetam orçamentos passados.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bloco 1: Infra */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-mono tracking-widest text-zinc-400 border-l-2 border-[#CCFF00] pl-2 uppercase">Infra & Máquina</h2>
                            
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Custo de Energia (R$ por kW/h)</label>
                                <input type="number" step="0.0001" 
                                    className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition-colors font-mono"
                                    value={data.energy_cost_kwh} onChange={e => setData('energy_cost_kwh', e.target.value)} required min="0" />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Depreciação/Manutenção da Máquina (R$/Hora)</label>
                                <input type="number" step="0.01"
                                    className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition-colors font-mono"
                                    value={data.machine_depreciation_hour} onChange={e => setData('machine_depreciation_hour', e.target.value)} required min="0" />
                            </div>
                        </div>

                        {/* Bloco 2: Mão de Obra e Margem */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-mono tracking-widest text-zinc-400 border-l-2 border-orange-500 pl-2 uppercase">Operação & Lucro</h2>
                            
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Valor Mão de Obra (R$/Hora)</label>
                                <input type="number" step="0.01"
                                    className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition-colors font-mono"
                                    value={data.man_hour_cost} onChange={e => setData('man_hour_cost', e.target.value)} required min="0" />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Taxa de Falha (% de Perda Acumulada)</label>
                                <input type="number" step="0.1"
                                    className="w-full bg-[#09090b] border border-orange-900 text-orange-400 p-3 rounded-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors font-mono max-w-xs"
                                    value={data.failure_rate_percent} onChange={e => setData('failure_rate_percent', e.target.value)} required min="0" />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Margem de Lucro Bruto (%)</label>
                                <input type="number" step="0.1"
                                    className="w-full bg-[#09090b] border border-green-900 text-[#CCFF00] p-3 shadow-[4px_4px_0px_#ccff0030] rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] transition-colors font-mono max-w-xs text-lg"
                                    value={data.profit_margin_percent} onChange={e => setData('profit_margin_percent', e.target.value)} required min="0" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#27272a]">
                        <button disabled={processing} type="submit" className="w-full md:w-auto px-8 bg-[#CCFF00] text-black font-bold uppercase tracking-widest py-4 hover:bg-[#b3e600] transition-colors border-none rounded-none disabled:opacity-50">
                            {processing ? 'SALVANDO...' : 'SALVAR PARÂMETROS GLOBAIS'}
                        </button>
                    </div>
                </form>
            </div>
        </SubNavigationLayout>
    );
}
