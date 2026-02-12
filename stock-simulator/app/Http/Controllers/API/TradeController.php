<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Trade;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TradeController extends Controller
{
    /**
     * Execute a trade (buy or sell).
     */
    public function execute(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'stock_id' => 'required|integer|exists:stocks,id',
            'type' => 'required|in:buy,sell',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], 422);
        }

        // For simplicity, using user ID 1 (predefined user)
        $userId = 1;

        try {
            DB::beginTransaction();

            $user = User::lockForUpdate()->find($userId);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $stock = Stock::lockForUpdate()->find($request->stock_id);
            if (!$stock) {
                return response()->json(['error' => 'Stock not found'], 404);
            }

            $quantity = $request->quantity;
            $type = $request->type;
            $totalCost = $stock->price * $quantity;

            if ($type === 'buy') {
                // Check if user has sufficient balance
                if ($user->balance < $totalCost) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Insufficient balance',
                        'required' => $totalCost,
                        'available' => $user->balance,
                    ], 400);
                }

                // Deduct balance
                $user->balance -= $totalCost;
                $user->save();

            } else { // sell
                // Check if user owns enough shares
                $ownedQuantity = $this->getUserStockQuantity($userId, $stock->id);
                
                if ($ownedQuantity < $quantity) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Insufficient stock quantity',
                        'required' => $quantity,
                        'available' => $ownedQuantity,
                    ], 400);
                }

                // Add balance
                $user->balance += $totalCost;
                $user->save();
            }

            // Record the trade
            $trade = Trade::create([
                'user_id' => $userId,
                'stock_id' => $stock->id,
                'type' => $type,
                'quantity' => $quantity,
                'price' => $stock->price,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Trade executed successfully',
                'trade' => $trade,
                'new_balance' => $user->balance,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Trade execution failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's current quantity for a specific stock.
     */
    private function getUserStockQuantity(int $userId, int $stockId): int
    {
        $result = Trade::where('user_id', $userId)
            ->where('stock_id', $stockId)
            ->selectRaw('SUM(CASE WHEN type = "buy" THEN quantity ELSE -quantity END) as total')
            ->first();

        return $result->total ?? 0;
    }
}