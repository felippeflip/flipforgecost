<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('energy_cost_kwh', 8, 4)->default(0);
            $table->decimal('machine_depreciation_hour', 8, 2)->default(0);
            $table->decimal('man_hour_cost', 8, 2)->default(0);
            $table->decimal('profit_margin_percent', 5, 2)->default(0);
            $table->decimal('failure_rate_percent', 5, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        Schema::create('consumables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('cost', 10, 2);
            $table->string('unit')->default('un');
            $table->timestamps();
        });

        Schema::create('filaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('brand');
            $table->string('color');
            $table->integer('initial_weight_g');
            $table->decimal('total_price', 10, 2);
            $table->timestamps();
        });

        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->uuid('uuid')->unique();
            $table->string('project_name');
            $table->string('image_path')->nullable();
            $table->integer('print_time_minutes')->default(0);
            $table->integer('manual_time_minutes')->default(0);
            $table->integer('machine_power_w')->nullable();
            $table->enum('status', ['pending', 'approved', 'production', 'completed'])->default('pending');
            $table->decimal('final_price', 12, 2)->default(0);
            
            // Historical Locked Variables
            $table->decimal('snap_energy_cost_kwh', 8, 4)->default(0);
            $table->decimal('snap_machine_depreciation_hour', 8, 2)->default(0);
            $table->decimal('snap_man_hour_cost', 8, 2)->default(0);
            $table->decimal('snap_profit_margin_percent', 5, 2)->default(0);
            $table->decimal('snap_failure_rate_percent', 5, 2)->default(0);
            
            $table->timestamps();
        });

        Schema::create('quote_filaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->foreignId('filament_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('weight_g');
            $table->decimal('price_per_gram_at_the_time', 10, 4);
            $table->timestamps();
        });

        Schema::create('quote_consumables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->foreignId('consumable_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('quantity', 8, 2)->default(1);
            $table->decimal('cost_at_the_time', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_consumables');
        Schema::dropIfExists('quote_filaments');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('filaments');
        Schema::dropIfExists('consumables');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('user_settings');
    }
};
