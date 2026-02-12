<?php

namespace Database\Seeders;

use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a default user
        User::create([
            'name' => 'Mario',
            'balance' => 10000.00,
        ]);

        // Create initial stocks
        $stocks = [
            ['symbol' => 'AAPL', 'price' => 150.00],
            ['symbol' => 'TSLA', 'price' => 710.00],
            ['symbol' => 'MSFT', 'price' => 320.00],
            ['symbol' => 'NVDA', 'price' => 450.00],
            ['symbol' => 'AMD', 'price' => 115.00],
        ];

        foreach ($stocks as $stock) {
            Stock::create($stock);
        }
    }
}