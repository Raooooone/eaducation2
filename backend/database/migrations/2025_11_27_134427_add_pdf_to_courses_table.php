<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// database/migrations/xxxx_add_pdf_to_courses_table.php
public function up()
{
    Schema::table('courses', function (Blueprint $table) {
        $table->string('pdf_path')->nullable()->after('description');
    });
}

public function down()
{
    Schema::table('courses', function (Blueprint $table) {
        $table->dropColumn('pdf_path');
    });
}
};
