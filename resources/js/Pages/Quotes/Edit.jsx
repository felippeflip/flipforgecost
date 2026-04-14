import { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ quote, clients, filaments, consumables, settings }) {
    const { data, setData, put, processing, errors, transform } = useForm({
        project_name: quote.project_name,
        client_id: quote.client_id || '',
        items_per_print: quote.items_per_print || 1,
        sale_type: quote.sale_type || 'direct',
        consignment_percent: quote.consignment_percent || 0,
        plates_data: quote.plates_data 
            ? quote.plates_data.map((p, idx) => ({
                ...p,
                filaments: p.filaments || (idx === 0 
                  ? (quote.filaments.length > 0 ? quote.filaments.map(f => ({ id: f.id, weight_g: f.pivot.weight_g })) : [{ id: '', weight_g: 0 }])
                  : [{ id: '', weight_g: 0 }])
            }))
            : [{ 
                hours: Math.floor(quote.print_time_minutes / 60) || 0, 
                mins: quote.print_time_minutes % 60 || 0,
                filaments: quote.filaments.length > 0 ? quote.filaments.map(f => ({ id: f.id, weight_g: f.pivot.weight_g })) : [{ id: '', weight_g: 0 }]
            }],
        manual_time_minutes: quote.manual_time_minutes,
        machine_power_w: quote.machine_power_w,
        status: quote.status,
        profit_margin_percent: quote.snap_profit_margin_percent ?? settings?.profit_margin_percent ?? 0,
        consumables: quote.consumables.map(c => ({ 
            id: c.id, 
            quantity: c.pivot.quantity,
            base_quantity: c.pivot.quantity,
            multiply: false
        }))
    });

    transform((data) => {
        let totalMinutes = 0;
        let mergedFils = {};

        data.plates_data.forEach(p => {
            totalMinutes += (parseInt(p.hours) || 0) * 60 + (parseInt(p.mins) || 0);

            p.filaments.forEach(f => {
                if (f.id && f.weight_g) {
                    if (!mergedFils[f.id]) mergedFils[f.id] = 0;
                    mergedFils[f.id] += parseInt(f.weight_g);
                }
            });
        });

        return {
            ...data,
            print_time_minutes: totalMinutes,
            filaments: Object.keys(mergedFils).map(id => ({ id: id, weight_g: mergedFils[id] })),
            consumables: data.consumables.map(c => ({
                id: c.id,
                quantity: c.multiply ? (parseFloat(c.base_quantity || c.quantity) * (parseInt(data.items_per_print) || 1)) : parseFloat(c.base_quantity || c.quantity)
            }))
        };
    });

    const addPlate = () => setData('plates_data', [...data.plates_data, { hours: 0, mins: 0, filaments: [{ id: '', weight_g: 0 }] }]);
    const removePlate = (idx) => setData('plates_data', data.plates_data.filter((_, i) => i !== idx));

    const updatePlateField = (idx, field, value) => {
        const newPlates = [...data.plates_data];
        newPlates[idx][field] = value;
        setData('plates_data', newPlates);
    };

    const addFilamentToPlate = (pIdx) => {
        const newPlates = [...data.plates_data];
        newPlates[pIdx].filaments.push({ id: '', weight_g: 0 });
        setData('plates_data', newPlates);
    };

    const removeFilamentFromPlate = (pIdx, fIdx) => {
        const newPlates = [...data.plates_data];
        newPlates[pIdx].filaments = newPlates[pIdx].filaments.filter((_, i) => i !== fIdx);
        setData('plates_data', newPlates);
    };

    const updateFilamentInPlate = (pIdx, fIdx, field, value) => {
        const newPlates = [...data.plates_data];
        newPlates[pIdx].filaments[fIdx][field] = value;
        setData('plates_data', newPlates);
    };

    const addConsumable = () => setData('consumables', [...data.consumables, { id: '', base_quantity: 1, multiply: true }]);
    const removeConsumable = (idx) => setData('consumables', data.consumables.filter((_, i) => i !== idx));
    const updateConsumable = (idx, field, value) => {
        const newCons = [...data.consumables];
        newCons[idx][field] = value;
        setData('consumables', newCons);
    };

    const previewCalculations = useMemo(() => {
        if (!settings) return { base: 0, withFailure: 0, final: 0 };
        
        let totalPrintTimeMinutes = 0;
        let filCost = 0;
        let consCost = 0;

        data.consumables.forEach(c => {
            if (c.id && (c.base_quantity || c.quantity)) {
                const con = consumables.find(x => x.id === parseInt(c.id));
                const finalQtd = c.multiply ? (parseFloat(c.base_quantity || c.quantity) * (parseInt(data.items_per_print) || 1)) : parseFloat(c.base_quantity || c.quantity);
                if (con) consCost += (con.cost * finalQtd);
            }
        });

        data.plates_data.forEach(p => {
            totalPrintTimeMinutes += (parseInt(p.hours) || 0) * 60 + (parseInt(p.mins) || 0);

            p.filaments.forEach(f => {
                if (f.id && f.weight_g) {
                    const fila = filaments.find(x => x.id === parseInt(f.id));
                    if (fila) filCost += (fila.price_per_gram * f.weight_g);
                }
            });
        });
        const mHours = totalPrintTimeMinutes / 60;
        const machCost = mHours * parseFloat(settings.machine_depreciation_hour || 0);
        
        const kwh = ((data.machine_power_w || 0) * mHours) / 1000;
        const enCost = kwh * parseFloat(settings.energy_cost_kwh || 0);

        const manHours = data.manual_time_minutes / 60;
        const manCost = manHours * parseFloat(settings.man_hour_cost || 0);

        const base = filCost + machCost + enCost + manCost + consCost;
        const withFailure = base * (1 + (parseFloat(settings.failure_rate_percent || 0) / 100));
        const final = withFailure * (1 + (parseFloat(data.profit_margin_percent || 0) / 100));

        return { filCost, machCost, enCost, manCost, consCost, base, withFailure, final };
    }, [data, filaments, consumables, settings]);

    const submit = (e) => {
        e.preventDefault();
        put(route('quotes.update', quote.id));
    };

    if (!settings) {
        return (
            <AppLayout>
                <div className="p-4 border border-red-500 bg-red-500/10 text-red-500 font-mono text-sm">
                    ERRO: Parâmetros do sistema não configurados.
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout header={`EDITANDO ORÇAMENTO: #${quote.formatted_id}`}>
            <Head title={`Editar Orçamento - ${quote.formatted_id}`} />

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-[70%] xl:w-[75%] space-y-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                            <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm mb-4 border-b border-[#27272a] pb-2">01. INFORMAÇÕES BASE</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Nome do Projeto</label>
                                    <input type="text" 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.project_name} onChange={e => setData('project_name', e.target.value)} required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Qtde. Itens</label>
                                    <input type="number" 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.items_per_print} onChange={e => setData('items_per_print', e.target.value)} required min="1"
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
                                <div className="lg:col-span-2">
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
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Tipo Venda</label>
                                    <select 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.sale_type} onChange={e => setData('sale_type', e.target.value)} required
                                    >
                                        <option value="direct">Direta</option>
                                        <option value="consignment">Consignação</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Lucro (%)</label>
                                    <input type="number" 
                                        className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                        value={data.profit_margin_percent} onChange={e => setData('profit_margin_percent', e.target.value)} required min="0" step="0.1"
                                    />
                                </div>
                                {data.sale_type === 'consignment' && (
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Taxa Consig. (%)</label>
                                        <input type="number" 
                                            className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none transition-colors"
                                            value={data.consignment_percent} onChange={e => setData('consignment_percent', e.target.value)} required min="0" max="100" step="0.1"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-[#27272a] pb-2">
                                <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm uppercase">02. PRATOS / MATERIAIS & DESEMPENHO</h2>
                                <button type="button" onClick={addPlate} className="text-xs font-mono text-zinc-400 hover:text-[#CCFF00] uppercase border border-zinc-700 px-2 py-1">
                                    + Adicionar Prato
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {data.plates_data.map((p, pIdx) => {
                                    const plateTheme = [
                                        { border: 'border-[#CCFF00]/40', bg: 'bg-[#CCFF00]/5', badge: 'text-[#CCFF00]' },
                                        { border: 'border-[#00f2fe]/40', bg: 'bg-[#00f2fe]/5', badge: 'text-[#00f2fe]' },
                                        { border: 'border-[#ff3366]/40', bg: 'bg-[#ff3366]/5', badge: 'text-[#ff3366]' },
                                        { border: 'border-[#ff9900]/40', bg: 'bg-[#ff9900]/5', badge: 'text-[#ff9900]' }
                                    ][pIdx % 4];

                                    return (
                                        <div key={pIdx} className={`p-4 border flex flex-col h-full ${plateTheme.bg} ${plateTheme.border} transition-colors`}>
                                            <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-2">
                                                <h3 className={`text-xs font-mono font-bold uppercase tracking-widest ${plateTheme.badge}`}>Prato {pIdx + 1}</h3>
                                                {data.plates_data.length > 1 && (
                                                    <button type="button" onClick={() => removePlate(pIdx)} className="text-[10px] text-red-500 hover:text-red-400 uppercase">Remover Prato</button>
                                                )}
                                            </div>

                                        <div className="flex gap-4 items-end mb-4">
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-mono text-zinc-500 uppercase">Tempo Impressão - Horas</label>
                                                <div className="relative">
                                                    <input type="number" 
                                                        className="w-full bg-transparent border-b border-zinc-800 text-white py-2 pr-6 focus:border-[#CCFF00] focus:ring-0 outline-none"
                                                        value={p.hours} onChange={e => updatePlateField(pIdx, 'hours', e.target.value)} required min="0"
                                                    />
                                                    <span className="absolute right-2 top-2 text-zinc-500 text-xs font-bold">h</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-mono text-zinc-500 uppercase">Minutos</label>
                                                <div className="relative">
                                                    <input type="number" 
                                                        className="w-full bg-transparent border-b border-zinc-800 text-white py-2 pr-6 focus:border-[#CCFF00] focus:ring-0 outline-none"
                                                        value={p.mins} onChange={e => updatePlateField(pIdx, 'mins', e.target.value)} required min="0" max="59"
                                                    />
                                                    <span className="absolute right-2 top-2 text-zinc-500 text-xs font-bold">m</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900/50 p-3 mt-2 border border-black/20">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-[10px] font-mono uppercase text-zinc-400">Filamentos deste prato</h4>
                                                <button type="button" onClick={() => addFilamentToPlate(pIdx)} className="text-[10px] font-mono text-zinc-500 hover:text-[#CCFF00] uppercase">
                                                    + Adicionar Cor
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {p.filaments.map((f, fIdx) => (
                                                    <div key={fIdx} className="flex gap-2 items-end">
                                                        <div className="flex-1">
                                                            <select 
                                                                className="w-full text-xs bg-transparent border-b border-zinc-800 text-white py-1 focus:border-[#CCFF00] focus:ring-0 outline-none"
                                                                value={f.id} onChange={e => updateFilamentInPlate(pIdx, fIdx, 'id', e.target.value)} required
                                                            >
                                                                <option value="" className="bg-zinc-900">Selecione o Filamento...</option>
                                                                {filaments?.map(fi => <option key={fi.id} value={fi.id} className="bg-zinc-900">{fi.color} - {fi.brand}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="w-24 relative">
                                                            <input type="number" 
                                                                className="w-full text-xs bg-transparent border-b border-zinc-800 text-white py-1 pr-6 focus:border-[#CCFF00] focus:ring-0 outline-none"
                                                                value={f.weight_g} onChange={e => updateFilamentInPlate(pIdx, fIdx, 'weight_g', e.target.value)} required min="1" placeholder="Peso"
                                                            />
                                                            <span className="absolute right-2 top-1.5 text-zinc-500 text-[10px] font-bold">g</span>
                                                        </div>
                                                        {p.filaments.length > 1 && (
                                                            <button type="button" onClick={() => removeFilamentFromPlate(pIdx, fIdx)} className="text-red-500 hover:text-red-400 pb-1 px-1 text-xs">✕</button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#27272a]">
                                <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Potência da Máquina (W) [Fixo p/ Todos]</label>
                                        <input type="number" 
                                            className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-[#CCFF00] focus:border-[#CCFF00]"
                                            value={data.machine_power_w} onChange={e => setData('machine_power_w', e.target.value)} min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-1 uppercase">Tempo Manual Total (Min) [Fixo p/ Todos]</label>
                                        <input type="number" 
                                            className="w-full bg-[#09090b] border border-[#27272a] text-white p-3 rounded-none focus:ring-[#CCFF00] focus:border-[#CCFF00]"
                                            value={data.manual_time_minutes} onChange={e => setData('manual_time_minutes', e.target.value)} required min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block: Insumos Adicionais */}
                        <div className="border border-[#27272a] bg-[#0f0f11] p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-[#27272a] pb-2">
                                <h2 className="text-[#CCFF00] font-mono tracking-widest text-sm uppercase">03. INSUMOS ADICIONAIS</h2>
                                <button type="button" onClick={addConsumable} className="text-xs font-mono text-zinc-400 hover:text-[#CCFF00] uppercase border border-zinc-700 px-2 py-1">
                                    + Adicionar Insumo
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {data.consumables.map((c, idx) => {
                                    const finalQtd = c.multiply ? (parseFloat(c.base_quantity || c.quantity || 0) * (parseInt(data.items_per_print) || 1)) : parseFloat(c.base_quantity || c.quantity || 0);
                                    return (
                                        <div key={idx} className="flex flex-col md:flex-row gap-4 md:items-end bg-[#09090b] p-3 border border-[#27272a]">
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-mono text-zinc-500 uppercase">Insumo</label>
                                                <select 
                                                    className="w-full bg-transparent border-b border-zinc-800 text-white py-2 focus:border-[#CCFF00] outline-none"
                                                    value={c.id} onChange={e => updateConsumable(idx, 'id', e.target.value)} required
                                                >
                                                    <option value="" className="bg-zinc-900">Selecione o Insumo...</option>
                                                    {consumables?.map(co => <option key={co.id} value={co.id} className="bg-zinc-900">{co.name} ({co.unit})</option>)}
                                                </select>
                                            </div>
                                            <div className="w-full md:w-24">
                                                <label className="block text-[10px] font-mono text-zinc-500 uppercase">Qtde (Base)</label>
                                                <input type="number" 
                                                    className="w-full bg-transparent border-b border-zinc-800 text-white py-2 focus:border-[#CCFF00] outline-none"
                                                    value={c.base_quantity ?? c.quantity ?? ''} onChange={e => updateConsumable(idx, 'base_quantity', e.target.value)} required min="0.1" step="0.1"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pb-2">
                                                <input type="checkbox" 
                                                    className="bg-[#09090b] border-zinc-600 text-[#CCFF00] focus:ring-[#CCFF00] rounded-sm"
                                                    checked={c.multiply} onChange={e => updateConsumable(idx, 'multiply', e.target.checked)}
                                                />
                                                <label className="text-[10px] font-mono text-zinc-400">
                                                    Multiplicar por<br/>({data.items_per_print}x itens)
                                                </label>
                                            </div>
                                            <div className="w-full md:w-24 pb-2 text-right">
                                                <span className="text-xs text-[#CCFF00] font-bold">Total: {finalQtd}</span>
                                            </div>
                                            <button type="button" onClick={() => removeConsumable(idx)} className="text-red-500 hover:text-red-400 pb-2 px-2">✕</button>
                                        </div>
                                    );
                                })}
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
                            <div className="flex justify-between border-b border-black/10 pb-1 text-[#ff3366] font-bold">
                                <span>INSUMOS EXTRA</span>
                                <span>R$ {previewCalculations.consCost.toFixed(2)}</span>
                            </div>
                            
                            <div className="pt-4 flex justify-between font-bold">
                                <span>TOTAL REDEFINIDO</span>
                                <span className="text-[#CCFF00]">R$ {previewCalculations.final.toFixed(2)}</span>
                            </div>

                            {data.items_per_print > 1 && (
                                <div className="flex justify-between text-[#ff3366] font-bold mt-2 pb-2 border-b border-white/10">
                                    <span>VALOR POR UNIDADE</span>
                                    <span>R$ {(previewCalculations.final / data.items_per_print).toFixed(2)}</span>
                                </div>
                            )}

                            {data.sale_type === 'consignment' && (
                                <div className="mt-4 pt-4 border-t border-white/20 bg-white/5 p-2 rounded-sm text-xs">
                                    <div className="font-bold mb-2 uppercase text-center text-[10px] tracking-widest text-[#ff3366]">Simulador de Consignação</div>
                                    <div className="flex justify-between mb-1">
                                        <span>Você Quer Receber:</span>
                                        <span className="font-bold">R$ {previewCalculations.final.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span>Taxa da Loja ({data.consignment_percent}%):</span>
                                        <span className="text-red-400">
                                            R$ {((previewCalculations.final / (1 - (data.consignment_percent / 100))) - previewCalculations.final).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-bold border-t border-white/20 pt-1 mt-1">
                                        <span>PREÇO NA LOJA:</span>
                                        <span>R$ {(previewCalculations.final / (1 - (data.consignment_percent / 100))).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
