-- Function to check if a user exists by email
-- Usage: SELECT * FROM check_user_exists_by_email('user@example.com');
-- Returns: Table with user_exists boolean column
-- Security: This function can access auth.users table with proper permissions

CREATE OR REPLACE FUNCTION check_user_exists_by_email(email_param text)
RETURNS TABLE (user_exists boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    SELECT EXISTS (
      SELECT 1 FROM auth.users WHERE email = email_param
    );
END;
$$;


-- Grant execute permission to authenticated users (or service role)
-- This allows the function to be called from your application
GRANT EXECUTE ON FUNCTION check_user_exists_by_email(text) TO SERVICE_ROLE;
GRANT EXECUTE ON FUNCTION check_user_exists_by_email(text) TO AUTHENTICATED;