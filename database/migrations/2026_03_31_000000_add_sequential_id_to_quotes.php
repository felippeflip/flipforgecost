<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->integer('sequential_id')->unsigned()->nullable()->after('id');
        });

        // Migrate existing quotes
        $users = \App\Models\User::all();
        foreach ($users as $user) {
            $quotes = \App\Models\Quote::where('user_id', $user->id)->orderBy('created_at')->get();
            $seq = 1;
            foreach ($quotes as $quote) {
                // Cannot use Eloquent update because Model might have events, just use DB raw
                \Illuminate\Support\Facades\DB::table('quotes')
                    ->where('id', $quote->id)
                    ->update(['sequential_id' => $seq++]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn('sequential_id');
        });
    }
};
