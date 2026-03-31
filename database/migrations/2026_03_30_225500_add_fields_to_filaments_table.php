<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('filaments', function (Blueprint $table) {
            $table->string('type')->default('PLA')->after('color');
            $table->string('quality')->nullable()->after('type');
            $table->date('purchase_date')->nullable()->after('quality');
        });
    }

    public function down(): void
    {
        Schema::table('filaments', function (Blueprint $table) {
            $table->dropColumn(['type', 'quality', 'purchase_date']);
        });
    }
};
