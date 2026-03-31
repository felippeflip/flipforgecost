<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => UserSetting::where('user_id', auth()->id())->first()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'energy_cost_kwh' => 'required|numeric|min:0',
            'machine_depreciation_hour' => 'required|numeric|min:0',
            'man_hour_cost' => 'required|numeric|min:0',
            'profit_margin_percent' => 'required|numeric|min:0',
            'failure_rate_percent' => 'required|numeric|min:0',
        ]);

        UserSetting::updateOrCreate(
            ['user_id' => auth()->id()],
            $validated
        );

        return redirect()->back()->with('success', 'Parâmetros atualizados!');
    }
}
