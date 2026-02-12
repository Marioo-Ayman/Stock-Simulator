<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use Illuminate\Http\JsonResponse;

class MarketController extends Controller
{
    /**
     * Get all stocks with current prices.
     */
    public function index(): JsonResponse
    {
        $stocks = Stock::orderBy('symbol')->get(['id', 'symbol', 'price']);
        
        return response()->json($stocks);
    }

    /**
     * Update all stock prices (market simulation).
     */
    public function updatePrices(): JsonResponse
    {
        $stocks = Stock::all();
        
        foreach ($stocks as $stock) {
            $stock->updatePrice();
        }
        
        return response()->json([
            'message' => 'Stock prices updated successfully',
            'stocks' => Stock::orderBy('symbol')->get(['id', 'symbol', 'price']),
        ]);
    }
}