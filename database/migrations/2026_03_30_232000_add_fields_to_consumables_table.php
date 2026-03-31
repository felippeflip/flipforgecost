<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumables', function (Blueprint $table) {
            $table->decimal('total_price', 10, 2)->default(0)->after('name');
            $table->decimal('quantity', 10, 2)->default(1)->after('total_price');
            $table->date('purchase_date')->nullable()->after('unit');
        });
    }

    public function down(): void
    {
        Schema::table('consumables', function (Blueprint $table) {
            $table->dropColumn(['total_price', 'quantity', 'purchase_date']);
        });
    }
};
