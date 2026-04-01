<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->integer('items_per_print')->default(1)->after('project_name');
            $table->string('sale_type')->default('direct')->after('items_per_print');
            $table->decimal('consignment_percent', 5, 2)->default(0)->after('sale_type');
            $table->json('plates_data')->nullable()->after('manual_time_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['items_per_print', 'sale_type', 'consignment_percent', 'plates_data']);
        });
    }
};
