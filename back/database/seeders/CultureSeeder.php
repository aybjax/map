<?php

namespace Database\Seeders;

use App\Models\Culture;
use Illuminate\Database\Seeder;

class CultureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Culture::create([
            'id' => 1,
            'name' => 'Пар',
            'color' => '#B71C1C',
        ]);
        Culture::create([
            'id' => 2,
            'name' => 'Пшеница',
            'color' => '#880E4F',
        ]);
        Culture::create([
            'id' => 3,
            'name' => 'Кукуруза',
            'color' => '#880E4F',
        ]);
        Culture::create([
            'id' => 4,
            'name' => 'Соя',
            'color' => '#311B92',
        ]);
        Culture::create([
            'id' => 5,
            'name' => 'Горох',
            'color' => '#01579B',
        ]);
        Culture::create([
            'id' => 6,
            'name' => 'Рапс',
            'color' => '#01579B',
        ]);
        Culture::create([
            'id' => 7,
            'name' => 'Ячмень',
            'color' => '#1B5E20',
        ]);
        Culture::create([
            'id' => 8,
            'name' => 'Сахарная свекла',
            'color' => '#827717',
        ]);
        Culture::create([
            'id' => 9,
            'name' => 'Подсолнечник',
            'color' => '#F57F17',
        ]);
        Culture::create([
            'id' => 10,
            'name' => 'иные угодья (не сельхоз угодия (водоемы, дорога, строение))',
            'color' => '#000000',
        ]);
    }
}