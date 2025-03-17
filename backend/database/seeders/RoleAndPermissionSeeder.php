<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            'create-categories',
            'read-categories',
            'update-categories',
            'delete-categories',
            'view',
            'create',
            'update',
            'delete'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'slug' => Str::slug($permission)]);
        }

        // Create admin role and attach permissions
        $adminRole = Role::create([
            'name' => 'Administrator',
            'slug' => 'admin'
        ]);

        $adminRole->permissions()->attach(Permission::all());
    }
}
