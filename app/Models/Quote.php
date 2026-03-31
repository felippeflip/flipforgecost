<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'uuid',
        'project_name',
        'image_path',
        'print_time_minutes',
        'manual_time_minutes',
        'machine_power_w',
        'status',
        'sequential_id',
        'final_price',
        // Historical Settings Lock
        'snap_energy_cost_kwh',
        'snap_machine_depreciation_hour',
        'snap_man_hour_cost',
        'snap_profit_margin_percent',
        'snap_failure_rate_percent',
    ];

    protected $appends = ['formatted_id'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quote) {
            if (empty($quote->sequential_id)) {
                $maxId = static::where('user_id', $quote->user_id)->max('sequential_id');
                $quote->sequential_id = $maxId ? $maxId + 1 : 1;
            }
        });
    }

    public function getFormattedIdAttribute()
    {
        return str_pad($this->sequential_id ?? $this->id, 4, '0', STR_PAD_LEFT);
    }

    public function filaments(): BelongsToMany
    {
        return $this->belongsToMany(Filament::class, 'quote_filaments')
                    ->withPivot('weight_g', 'price_per_gram_at_the_time')
                    ->withTimestamps();
    }

    public function consumables(): BelongsToMany
    {
        return $this->belongsToMany(Consumable::class, 'quote_consumables')
                    ->withPivot('quantity', 'cost_at_the_time')
                    ->withTimestamps();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
