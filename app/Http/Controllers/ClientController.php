<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Clients/Index', [
            'clients' => Client::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        Client::create(array_merge($validated, ['user_id' => auth()->id()]));

        return redirect()->back();
    }

    public function destroy(Client $client)
    {
        if ($client->user_id !== auth()->id()) abort(403);
        $client->delete();
        return redirect()->back();
    }
}
