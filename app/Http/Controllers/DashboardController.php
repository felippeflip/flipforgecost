<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Key Metrics
        $totalQuotes = Quote::where('user_id', $user->id)->count();
        $approvedAmount = Quote::where('user_id', $user->id)->whereIn('status', ['approved', 'completed', 'production'])->sum('final_price');
        $pendingQuotesCount = Quote::where('user_id', $user->id)->where('status', 'pending')->count();
        $pendingAmount = Quote::where('user_id', $user->id)->where('status', 'pending')->sum('final_price');
        
        // Latest Quotes List
        $recentQuotes = Quote::where('user_id', $user->id)
            ->with(['client'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Top Clients (Grouped logically by PHP to support null client gracefully)
        $approvedQuotes = Quote::where('user_id', $user->id)->whereIn('status', ['approved', 'completed', 'production'])->with('client')->get();
        $clientsArray = [];
        
        foreach ($approvedQuotes as $quote) {
            $clientId = $quote->client_id ?? 'avulso';
            if (!isset($clientsArray[$clientId])) {
                $clientsArray[$clientId] = [
                    'name' => $quote->client ? $quote->client->name : 'Avulso (S/Cliente)',
                    'total_approved' => 0,
                    'approved_count' => 0,
                ];
            }
            $clientsArray[$clientId]['total_approved'] += (float) $quote->final_price;
            $clientsArray[$clientId]['approved_count'] += 1;
        }

        // Sort descending
        usort($clientsArray, function($a, $b) {
            return $b['total_approved'] <=> $a['total_approved'];
        });

        $topClients = array_slice($clientsArray, 0, 4);

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_quotes' => $totalQuotes,
                'approved_amount' => $approvedAmount,
                'pending_count' => $pendingQuotesCount,
                'pending_amount' => $pendingAmount,
            ],
            'recent_quotes' => $recentQuotes,
            'top_clients' => $topClients,
        ]);
    }
}
