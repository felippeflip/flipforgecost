<?php

namespace App\Http\Controllers;

use App\Models\Consumable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsumableController extends Controller
{
    public function index()
    {
        return Inertia::render('Consumables/Index', [
            'consumables' => Consumable::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'total_price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:10',
            'purchase_date' => 'nullable|date',
        ]);

        $cost = $validated['total_price'] / $validated['quantity'];

        Consumable::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'cost' => $cost
        ]));

        return redirect()->back();
    }

    public function destroy(Consumable $consumable)
    {
        if ($consumable->user_id !== auth()->id()) abort(403);
        $consumable->delete();
        return redirect()->back();
    }
}
