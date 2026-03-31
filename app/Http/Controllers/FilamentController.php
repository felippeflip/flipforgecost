<?php

namespace App\Http\Controllers;

use App\Models\Filament;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FilamentController extends Controller
{
    public function index()
    {
        return Inertia::render('Filaments/Index', [
            'filaments' => Filament::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get()->map(function($f) {
                $f->price_per_gram = $f->price_per_gram;
                return $f;
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'quality' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'initial_weight_g' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
        ]);

        Filament::create(array_merge($validated, ['user_id' => auth()->id()]));

        return redirect()->back();
    }

    public function destroy(Filament $filament)
    {
        if ($filament->user_id !== auth()->id()) abort(403);
        $filament->delete();
        return redirect()->back();
    }
}
