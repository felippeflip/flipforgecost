<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'energy_cost_kwh',
        'machine_depreciation_hour',
        'man_hour_cost',
        'profit_margin_percent',
        'failure_rate_percent',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
