import { useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
}

const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const { isSignedIn, userData } = await response.json();
        setIsSignedIn(isSignedIn);
        setUser(userData);
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    };

    fetchUserSession();
  }, []);

  return { isSignedIn, user };
};

export default useSession;
