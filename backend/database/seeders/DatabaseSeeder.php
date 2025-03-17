<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin role if not exists
        $adminRole = Role::where('slug', 'admin')->first();
        if (!$adminRole) {
            $adminRole = Role::create([
                'name' => 'Administrator',
                'slug' => 'admin'
            ]);
        }

        // Create admin user if not exists
        $admin = User::where('email', 'admin@example.com')->first();
        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password')
            ]);

            // Assign role
            $admin->roles()->sync([$adminRole->id]);
        }
    }
}
