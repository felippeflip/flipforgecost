<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Filament extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'brand',
        'color',
        'type',
        'quality',
        'purchase_date',
        'initial_weight_g',
        'total_price',
    ];

    protected $casts = [
        'purchase_date' => 'date',
    ];

    /**
     * Get the price per gram attribute.
     */
    public function getPricePerGramAttribute()
    {
        if ($this->initial_weight_g <= 0) return 0;
        return $this->total_price / $this->initial_weight_g;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
