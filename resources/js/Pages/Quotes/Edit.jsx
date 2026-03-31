import { useState, useMemo } from 'react';
import SubNavigationLayout from '@/Layouts/SubNavigationLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ quote, clients, filaments, consumables, settings }) {
    const { data, setData, put, processing, errors, transform } = useForm({
        project_name: quote.project_name,
        client_id: quote.client_id || '',
        print_time_hours: Math.floor(quote.print_time_minutes / 60),
        print_time_mins: quote.print_time_minutes % 60,
        manual_time_minutes: quote.manual_time_minutes,
        machine_power_w: quote.machine_power_w,
        status: quote.status,
        filaments: quote.filaments.length > 0 ? quote.filaments.map(f => ({ id: f.id, weight_g: f.pivot.weight_g })) : [{ id: '', weight_g: 0 }],
        consumables: quote.consumables.map(c => ({ id: c.id, quantity: c.pivot.quantity }))
    });

    transform((data) => ({
        ...data,
        print_time_minutes: (parseInt(data.print_time_hours) || 0) * 60 + (parseInt(data.print_time_mins) || 0),
    }));

    const addFilament = () => setData('filaments', [...data.filaments, { id: '', weight_g: 0 }]);
    const removeFilament = (idx) => setData('filaments', data.filaments.filter((_, i) => i !== idx));

    const updateFilament = (idx, field, value) => {
        const newFils = [...data.filaments];
        newFils[idx][field] = value;
        setData('filaments', newFils);
    };

    const previewCalculations = useMemo(() => {
        if (!settings) return { base: 0, withFailure: 0, final: 0 };
        
        let filCost = 0;
        data.filaments.forEach(f => {
            if (f.id && f.weight_g) {
                const fila = filaments.find(x => x.id === parseInt(f.id));
                if (fila) filCost += (fila.price_per_gram * f.weight_g);
            }
        });

        const totalPrintTimeMinutes = (parseInt(data.print_time_hours) || 0) * 60 + (parseInt(data.print_time_mins) || 0);
        const mHours = totalPrintTimeMinutes / 60;
        const machCost = mHours * parseFloat(settings.machine_depreciation_hour || 0);
        
        const kwh = ((data.machine_power_w || 0) * mHours) / 1000;
        const enCost = kwh * parseFloat(settings.energy_cost_kwh || 0);

        const manHours = data.manual_time_minutes / 60;
        const manCost = manHours * parseFloat(settings.man_hour_cost || 0);

        const base = filCost + machCost + enCost + manCost;
        const withFailure = base * (1 + (parseFloat(settings.failure_rate_percent || 0) / 100));
        const final = withFailure * (1 + (parseFloat(settings.profit_margin_percent || 0) / 100));

        return { filCost, machCost, enCost, manCost, base, withFailure, final };
    }, [data, filaments, settings]);

    const submit = (e) => {
        e.preventDefault();
        put(route('quotes.update', quote.id));
    };

    if (!settings) {
        return (
            <SubNavigationLayout>
                <div className="p-4 border border-red-500 bg-red-500/10 text-red-500 font-mono text-sm">
                    ERRO: Parâmetros do sistema não configurados.
                </div>
            </SubNavigationLayout>
        );
    }

    return (
        <SubNavigationLayout header={`EDITANDO ORÇAMENTO: #${quote.formatted_id}`}>
            <Head title={`Editar Orçamento - ${quote.formatted_id}`} />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-[70%] xl:w-[75%] space-y-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                            <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-4 border-b border-[#27272a] pb-2">01. INFORMAÇÕES BASE</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Nome do Projeto</label>
                                    <input type="text" 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.project_name} onChange={e => setData('project_name', e.target.value)} required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Cliente</label>
                                    <select 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.client_id} onChange={e => setData('client_id', e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Status CRM</label>
                                    <select 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.status} onChange={e => setData('status', e.target.value)} required
                                    >
                                        <option value="pending">Pendente de Aprovação</option>
                                        <option value="approved">Aprovado</option>
                                        <option value="production">Em Produção</option>
                                        <option value="completed">Concluído</option>
                                        <option value="rejected">Rejeitado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                            <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-4 border-b border-[#27272a] pb-2">02. PERFORMANCE & TEMPO</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Tempo Impressão</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input type="number" 
                                                className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 pr-6 rounded-none focus:ring-[#CCFF00] focus:border-[#CCFF00] text-center"
                                                value={data.print_time_hours} onChange={e => setData('print_time_hours', e.target.value)} required min="0"
                                            />
                                            <span className="absolute right-2 top-3 text-zinc-500 text-xs font-bold">h</span>
                                        </div>
                                        <div className="relative flex-1">
                                            <input type="number" 
                                                className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 pr-6 rounded-none focus:ring-[#CCFF00] focus:border-[#CCFF00] text-center"
                                                value={data.print_time_mins} onChange={e => setData('print_time_mins', e.target.value)} required min="0" max="59"
                                            />
                                            <span className="absolute right-2 top-3 text-zinc-500 text-xs font-bold">m</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Potência (W)</label>
                                    <input type="number" 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-[#CCFF00] focus:border-[#CCFF00]"
                                        value={data.machine_power_w} onChange={e => setData('machine_power_w', e.target.value)} min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Tempo Manual (Min)</label>
                                    <input type="number" 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-[#CCFF00] focus:border-[#CCFF00]"
                                        value={data.manual_time_minutes} onChange={e => setData('manual_time_minutes', e.target.value)} required min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-[#27272a] pb-2">
                                <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm uppercase">03. MATERIAIS / FILAMENTOS</h2>
                                <button type="button" onClick={addFilament} className="text-xs font-mono text-zinc-400 hover:text-[#CCFF00] uppercase border border-zinc-700 px-2 py-1">
                                    + Adicionar Cor
                                </button>
                            </div>
                            <div className="space-y-3">
                                {data.filaments.map((f, idx) => (
                                    <div key={idx} className="flex gap-4 items-end bg-[#09090b] p-3 border border-[#27272a]">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-mono text-zinc-500 uppercase">Filamento</label>
                                            <select 
                                                className="w-full bg-transparent border-b border-zinc-800 text-white py-2 focus:border-[#CCFF00] outline-none"
                                                value={f.id} onChange={e => updateFilament(idx, 'id', e.target.value)} required
                                            >
                                                <option value="" className="bg-zinc-900">Selecione...</option>
                                                {filaments?.map(fi => <option key={fi.id} value={fi.id} className="bg-zinc-900">{fi.color} - {fi.brand}</option>)}
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <label className="block text-[10px] font-mono text-zinc-500 uppercase">Peso (g)</label>
                                            <input type="number" 
                                                className="w-full bg-transparent border-b border-zinc-800 text-white py-2 focus:border-[#CCFF00] outline-none"
                                                value={f.weight_g} onChange={e => updateFilament(idx, 'weight_g', e.target.value)} required min="1"
                                            />
                                        </div>
                                        {data.filaments.length > 1 && (
                                            <button type="button" onClick={() => removeFilament(idx)} className="text-red-500 hover:text-red-400 pb-2 px-2">✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button disabled={processing} type="submit" className="w-full bg-[#1e293b] text-white font-bold uppercase tracking-widest py-4 hover:bg-zinc-700 transition-colors border-none rounded-none disabled:opacity-50">
                            {processing ? 'ATUALIZANDO...' : 'SALVAR ALTERAÇÕES NO ORÇAMENTO'}
                        </button>
                    </form>
                </div>

                <div className="w-full lg:w-[30%] xl:w-[25%] sticky top-8">
                    <div className="border border-[#27272a] bg-zinc-900 text-white p-6 shadow-[8px_8px_0px_#27272a]">
                        <h3 className="font-mono font-bold tracking-tighter text-xl mb-6 border-b border-black/20 pb-2">NOVO RE-CÁLCULO</h3>
                        
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-black/10 pb-1">
                                <span className="opacity-70">MATERIAIS</span>
                                <span>R$ {previewCalculations.filCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-black/10 pb-1">
                                <span className="opacity-70">DEPREC. MÁQ.</span>
                                <span>R$ {previewCalculations.machCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-black/10 pb-1">
                                <span className="opacity-70">ENERGIA</span>
                                <span>R$ {previewCalculations.enCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-black/10 pb-1">
                                <span className="opacity-70">MÃO DE OBRA</span>
                                <span>R$ {previewCalculations.manCost.toFixed(2)}</span>
                            </div>
                            
                            <div className="pt-4 flex justify-between font-bold">
                                <span>SUBTOTAL</span>
                                <span>R$ {previewCalculations.base.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-white/50">
                                <span>+ FALHA ({settings.failure_rate_percent}%)</span>
                                <span>R$ {(previewCalculations.withFailure - previewCalculations.base).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-white/50">
                                <span>+ LUCRO ({settings.profit_margin_percent}%)</span>
                                <span>R$ {(previewCalculations.final - previewCalculations.withFailure).toFixed(2)}</span>
                            </div>

                            <div className="pt-6 mt-4 border-t-2 border-white flex flex-col items-center">
                                <span className="text-xs uppercase tracking-widest opacity-70 mb-1">TOTAL REDEFINIDO</span>
                                <span className="text-3xl font-bold tracking-tighter text-[#CCFF00]">R$ {previewCalculations.final.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SubNavigationLayout>
    );
}
