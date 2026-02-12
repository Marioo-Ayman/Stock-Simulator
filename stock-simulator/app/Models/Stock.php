<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Get all trades for this stock.
     */
    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }

    /**
     * Update stock price with random movement.
     */
    public function updatePrice(): void
    {
        // Random percentage change between -5% and +5%
        $percentageChange = (rand(-500, 500) / 100) / 100;
        $newPrice = $this->price * (1 + $percentageChange);
        
        // Ensure price never goes below 1
        $this->price = max(1, round($newPrice, 2));
        $this->save();
    }
}