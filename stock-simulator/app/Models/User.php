<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'balance',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
    ];

    /**
     * Get all trades for the user.
     */
    public function trades(): HasMany
    {
        return $this->hasMany(Trade::class);
    }

    /**
     * Get user's portfolio positions.
     */
    public function getPortfolioPositions()
    {
        $positions = $this->trades()
            ->selectRaw('
                stock_id,
                SUM(CASE WHEN type = "buy" THEN quantity ELSE -quantity END) as total_quantity,
                SUM(CASE WHEN type = "buy" THEN quantity * price ELSE 0 END) as total_buy_cost,
                SUM(CASE WHEN type = "buy" THEN quantity ELSE 0 END) as total_buy_quantity
            ')
            ->groupBy('stock_id')
            ->havingRaw('total_quantity > 0')
            ->get();

        return $positions->map(function ($position) {
            $stock = Stock::find($position->stock_id);
            $avgPrice = $position->total_buy_quantity > 0 
                ? $position->total_buy_cost / $position->total_buy_quantity 
                : 0;
            $profitLoss = ($stock->price - $avgPrice) * $position->total_quantity;

            return [
                'symbol' => $stock->symbol,
                'quantity' => $position->total_quantity,
                'avg_price' => round($avgPrice, 2),
                'current_price' => $stock->price,
                'profit_loss' => round($profitLoss, 2),
            ];
        });
    }
}