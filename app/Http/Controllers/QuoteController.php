<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Filament;
use App\Models\Consumable;
use App\Models\Quote;
use App\Models\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuoteController extends Controller
{
    public function index()
    {
        $quotes = Quote::where('user_id', auth()->id())->with(['client'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Quotes/Index', ['quotes' => $quotes]);
    }

    public function show($id)
    {
        $quote = Quote::where('user_id', auth()->id())
            ->with(['client', 'filaments', 'consumables'])
            ->findOrFail($id);
            
        return Inertia::render('Quotes/Show', ['quote' => $quote]);
    }

    public function create()
    {
        $user = auth()->user();
        
        return Inertia::render('Quotes/Create', [
            'clients' => Client::where('user_id', $user->id)->get(),
            'filaments' => Filament::where('user_id', $user->id)->get()->map(function($f) {
                $f->price_per_gram = $f->price_per_gram; // Append mutator
                return $f;
            }),
            'consumables' => Consumable::where('user_id', $user->id)->get(),
            'settings' => UserSetting::where('user_id', $user->id)->first(),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $settings = UserSetting::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'client_id' => 'nullable|exists:clients,id',
            'items_per_print' => 'required|integer|min:1',
            'sale_type' => 'required|in:direct,consignment',
            'consignment_percent' => 'nullable|numeric|min:0|max:100',
            'plates_data' => 'nullable|array',
            'print_time_minutes' => 'required|integer|min:0',
            'manual_time_minutes' => 'required|integer|min:0',
            'machine_power_w' => 'nullable|integer|min:0',
            'filaments' => 'required|array|min:1',
            'filaments.*.id' => 'required|exists:filaments,id',
            'filaments.*.weight_g' => 'required|integer|min:1',
            'consumables' => 'nullable|array',
            'consumables.*.id' => 'required|exists:consumables,id',
            'consumables.*.quantity' => 'required|numeric|min:0.1',
        ]);

        // Historical Lock & Quote Creation
        $quote = Quote::create([
            'user_id' => $user->id,
            'client_id' => $validated['client_id'] ?? null,
            'uuid' => (string) Str::uuid(),
            'project_name' => $validated['project_name'],
            'items_per_print' => $validated['items_per_print'],
            'sale_type' => $validated['sale_type'],
            'consignment_percent' => $validated['consignment_percent'] ?? 0,
            'plates_data' => $validated['plates_data'] ?? null,
            'print_time_minutes' => $validated['print_time_minutes'],
            'manual_time_minutes' => $validated['manual_time_minutes'],
            'machine_power_w' => $validated['machine_power_w'],
            'snap_energy_cost_kwh' => $settings->energy_cost_kwh,
            'snap_machine_depreciation_hour' => $settings->machine_depreciation_hour,
            'snap_man_hour_cost' => $settings->man_hour_cost,
            'snap_profit_margin_percent' => $settings->profit_margin_percent,
            'snap_failure_rate_percent' => $settings->failure_rate_percent,
        ]);

        $totalFilamentCost = 0;
        foreach ($validated['filaments'] as $fData) {
            $filament = Filament::where('user_id', $user->id)->findOrFail($fData['id']);
            $quote->filaments()->attach($filament->id, [
                'weight_g' => $fData['weight_g'],
                'price_per_gram_at_the_time' => $filament->price_per_gram,
            ]);
            $totalFilamentCost += ($fData['weight_g'] * $filament->price_per_gram);
        }

        $totalConsumablesCost = 0;
        if (!empty($validated['consumables'])) {
            foreach ($validated['consumables'] as $cData) {
                $consumable = Consumable::where('user_id', $user->id)->findOrFail($cData['id']);
                $quote->consumables()->attach($consumable->id, [
                    'quantity' => $cData['quantity'],
                    'cost_at_the_time' => $consumable->cost,
                ]);
                $totalConsumablesCost += ($cData['quantity'] * $consumable->cost);
            }
        }

        // Calculation Algorithm
        $hoursMachine = $quote->print_time_minutes / 60;
        $machineCost = $hoursMachine * $quote->snap_machine_depreciation_hour;
        
        $energyCost = 0;
        if ($quote->machine_power_w) {
            $kwh = ($quote->machine_power_w * $hoursMachine) / 1000;
            $energyCost = $kwh * $quote->snap_energy_cost_kwh;
        }

        $hoursManual = $quote->manual_time_minutes / 60;
        $manualCost = $hoursManual * $quote->snap_man_hour_cost;

        $baseCost = $totalFilamentCost + $machineCost + $energyCost + $manualCost + $totalConsumablesCost;
        
        // Failure rate is functional over the base cost
        $costWithFailure = $baseCost * (1 + ($quote->snap_failure_rate_percent / 100));
        
        // Final Price
        $finalPrice = $costWithFailure * (1 + ($quote->snap_profit_margin_percent / 100));
        
        $quote->update(['final_price' => $finalPrice]);

        return redirect()->route('quotes.show', $quote->id)->with('success', 'Orçamento gerado!');
    }

    public function edit($id)
    {
        $user = auth()->user();
        $quote = Quote::where('user_id', $user->id)
            ->with(['filaments', 'consumables'])
            ->findOrFail($id);
            
        return Inertia::render('Quotes/Edit', [
            'quote' => $quote,
            'clients' => Client::where('user_id', $user->id)->get(),
            'filaments' => Filament::where('user_id', $user->id)->get()->map(function($f) {
                $f->price_per_gram = $f->price_per_gram;
                return $f;
            }),
            'consumables' => Consumable::where('user_id', $user->id)->get(),
            'settings' => UserSetting::where('user_id', $user->id)->first(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $quote = Quote::where('user_id', $user->id)->findOrFail($id);
        $settings = UserSetting::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'client_id' => 'nullable|exists:clients,id',
            'items_per_print' => 'required|integer|min:1',
            'sale_type' => 'required|in:direct,consignment',
            'consignment_percent' => 'nullable|numeric|min:0|max:100',
            'plates_data' => 'nullable|array',
            'print_time_minutes' => 'required|integer|min:0',
            'manual_time_minutes' => 'required|integer|min:0',
            'machine_power_w' => 'nullable|integer|min:0',
            'status' => 'required|in:pending,approved,production,completed,rejected',
            'filaments' => 'required|array|min:1',
            'filaments.*.id' => 'required|exists:filaments,id',
            'filaments.*.weight_g' => 'required|integer|min:1',
            'consumables' => 'nullable|array',
            'consumables.*.id' => 'required|exists:consumables,id',
            'consumables.*.quantity' => 'required|numeric|min:0.1',
        ]);

        $quote->update([
            'client_id' => $validated['client_id'] ?? null,
            'project_name' => $validated['project_name'],
            'items_per_print' => $validated['items_per_print'],
            'sale_type' => $validated['sale_type'],
            'consignment_percent' => $validated['consignment_percent'] ?? 0,
            'plates_data' => $validated['plates_data'] ?? null,
            'status' => $validated['status'],
            'print_time_minutes' => $validated['print_time_minutes'],
            'manual_time_minutes' => $validated['manual_time_minutes'],
            'machine_power_w' => $validated['machine_power_w'],
            // Updates snap to current settings upon edit (refreshing costs)
            'snap_energy_cost_kwh' => $settings->energy_cost_kwh,
            'snap_machine_depreciation_hour' => $settings->machine_depreciation_hour,
            'snap_man_hour_cost' => $settings->man_hour_cost,
            'snap_profit_margin_percent' => $settings->profit_margin_percent,
            'snap_failure_rate_percent' => $settings->failure_rate_percent,
        ]);

        // Re-sync filaments
        $totalFilamentCost = 0;
        $quote->filaments()->detach();
        foreach ($validated['filaments'] as $fData) {
            $filament = Filament::where('user_id', $user->id)->findOrFail($fData['id']);
            $quote->filaments()->attach($filament->id, [
                'weight_g' => $fData['weight_g'],
                'price_per_gram_at_the_time' => $filament->price_per_gram,
            ]);
            $totalFilamentCost += ($fData['weight_g'] * $filament->price_per_gram);
        }

        // Re-sync consumables
        $totalConsumablesCost = 0;
        $quote->consumables()->detach();
        if (!empty($validated['consumables'])) {
            foreach ($validated['consumables'] as $cData) {
                $consumable = Consumable::where('user_id', $user->id)->findOrFail($cData['id']);
                $quote->consumables()->attach($consumable->id, [
                    'quantity' => $cData['quantity'],
                    'cost_at_the_time' => $consumable->cost,
                ]);
                $totalConsumablesCost += ($cData['quantity'] * $consumable->cost);
            }
        }

        // Calculation Algorithm
        $hoursMachine = $quote->print_time_minutes / 60;
        $machineCost = $hoursMachine * $quote->snap_machine_depreciation_hour;
        
        $energyCost = 0;
        if ($quote->machine_power_w) {
            $kwh = ($quote->machine_power_w * $hoursMachine) / 1000;
            $energyCost = $kwh * $quote->snap_energy_cost_kwh;
        }

        $hoursManual = $quote->manual_time_minutes / 60;
        $manualCost = $hoursManual * $quote->snap_man_hour_cost;

        $baseCost = $totalFilamentCost + $machineCost + $energyCost + $manualCost + $totalConsumablesCost;
        
        $costWithFailure = $baseCost * (1 + ($quote->snap_failure_rate_percent / 100));
        $finalPrice = $costWithFailure * (1 + ($quote->snap_profit_margin_percent / 100));
        
        $quote->update(['final_price' => $finalPrice]);

        return redirect()->route('quotes.show', $quote->id)->with('success', 'Orçamento atualizado!');
    }
}
