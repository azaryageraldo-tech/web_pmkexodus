<?php

namespace App\Traits;

use App\Models\Role;

trait HasRoles
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasPermissionTo($permission)
    {
        return $this->roles->flatMap(function ($role) {
            return $role->permissions;
        })->pluck('slug')->contains($permission);
    }

    // Tambahkan method baru ini
    public function getAllPermissions()
    {
        return $this->roles->flatMap(function ($role) {
            return $role->permissions;
        })->unique('id');
    }
}