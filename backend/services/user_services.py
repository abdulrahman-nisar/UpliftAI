from data.users import users

def authenticate_user(username: str, password: str) -> int:
    """
    Authenticate a user based on username and password.

    Args:
        username (str): The username of the user attempting to log in.
        password (str): The password of the user attempting to log in.

    Returns:
        int: The user ID if authentication is successful.
             Returns -1 (or None) if authentication fails.
    """

    for user in users:
        if user.user_name == username and user.password == password:
            return True
        
    return False
            
