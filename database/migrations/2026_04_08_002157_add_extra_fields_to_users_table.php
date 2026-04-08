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
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->after('email_verified_at');
            $table->string('role')->default('user')->after('status');
            $table->string('zip_code')->nullable()->after('password');
            $table->string('address')->nullable()->after('zip_code');
            $table->string('number')->nullable()->after('address');
            $table->string('complement')->nullable()->after('number');
            $table->string('neighborhood')->nullable()->after('complement');
            $table->string('city')->nullable()->after('neighborhood');
            $table->string('state')->nullable()->after('city');
            $table->string('google_id')->nullable()->after('state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'role',
                'zip_code',
                'address',
                'number',
                'complement',
                'neighborhood',
                'city',
                'state',
                'google_id'
            ]);
        });
    }
};
