# Supabase

This directory contains Supabase related objects and functions for the project.

## Functions

### `check_user_exists_by_email(email_param text)`

- **Purpose**: Check if a user exists in the auth.users table by email
- **Returns**: Table with `user_exists` boolean column
- **Usage**: Called from server actions to validate signup forms
- **Security**: Uses `security definer` to access auth.users table with proper permissions

## Deployment

Run these SQL files in the Supabase SQL Editor when setting up the project.
