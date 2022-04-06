<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCultureFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suggestion_culture_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('culture_id')->nullable();
            $table->foreignId('field_id')->nullable();
            $table->integer('year')->nullable();
            $table->foreignId('user_id')->nullable();
            $table->string('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('planted_culture_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('culture_id')->nullable();
            $table->foreignId('field_id')->nullable();
            $table->integer('year')->nullable();
            $table->string('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('suggestion_culture_fields');
        Schema::dropIfExists('planted_culture_fields');
    }
}