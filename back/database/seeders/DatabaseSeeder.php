<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->seedAdmin();

        $this->call([
            CultureSeeder::class,
            LayerSeeder::class,
        ]);
    }

    protected function seedAdmin()
    {
        $password = Hash::make('админ');

        User::create([
            'username' => 'админ',
            'password' => $password,
            'is_admin' => 1,
        ]);
    }
}