<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PortfolioController extends Controller
{
    /**
     * Get user's portfolio.
     */
    public function index(): JsonResponse
    {
        //predefined user
        $userId = 1;

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $positions = $user->getPortfolioPositions();

        return response()->json([
            'balance' => $user->balance,
            'positions' => $positions,
        ]);
    }
}