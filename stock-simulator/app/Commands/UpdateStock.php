<?php

namespace App\Commands;

use App\Models\Stock;
use Illuminate\Command;

class UpdateStockPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stocks:update-prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all stock prices with random movements';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $stocks = Stock::all();
        
        foreach ($stocks as $stock) {
            $oldPrice = $stock->price;
            $stock->updatePrice();
            
            $this->info("Updated {$stock->symbol}: {$oldPrice} -> {$stock->price}");
        }
        
        $this->info('All stock prices updated successfully!');
        
        return Command::SUCCESS;
    }
}