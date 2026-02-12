<?php

use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\TradeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
Route::get('/test', function () {
    return response()->json(['status' => 'API working']);
});
// Market endpoints
Route::get('/market', [MarketController::class, 'index']);
Route::post('/market/update-prices', [MarketController::class, 'updatePrices']);

// Trading endpoints
Route::post('/trade', [TradeController::class, 'execute']);

// Portfolio endpoints
Route::get('/portfolio', [PortfolioController::class, 'index']);