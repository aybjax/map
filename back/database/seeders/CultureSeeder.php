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
            'color' => '#EF9A9A',
        ]);
        Culture::create([
            'id' => 2,
            'name' => 'Пшеница',
            'color' => '#F48FB1',
        ]);
        Culture::create([
            'id' => 3,
            'name' => 'Кукуруза',
            'color' => '#CE93D8',
        ]);
        Culture::create([
            'id' => 4,
            'name' => 'Соя',
            'color' => '#B39DDB',
        ]);
        Culture::create([
            'id' => 5,
            'name' => 'Горох',
            'color' => '#9FA8DA',
        ]);
        Culture::create([
            'id' => 6,
            'name' => 'Рапс',
            'color' => '#90CAF9',
        ]);
        Culture::create([
            'id' => 7,
            'name' => 'Ячмень',
            'color' => '#81D4FA',
        ]);
        Culture::create([
            'id' => 8,
            'name' => 'Сахарная свекла',
            'color' => '#80CBC4',
        ]);
        Culture::create([
            'id' => 9,
            'name' => 'Подсолнечник',
            'color' => '#A5D6A7',
        ]);
        Culture::create([
            'id' => 10,
            'name' => 'иные угодья (не сельхоз угодия (водоемы, дорога, строение))',
            'color' => '#212121',
        ]);
    }
}