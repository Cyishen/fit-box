// import { useEffect, useState } from 'react';


// const useHonoSession = () => {
//   const [user, setUser] = useState<UserModelType | null>(null);
//   const [isSignedIn, setIsSignedIn] = useState(false);

//   useEffect(() => {
//     const fetchUserSession = async () => {
//       const response = await fetch('/api/hono/session');
//       if (response.ok) {
//         const { isSignedIn, userData } = await response.json();
//         setIsSignedIn(isSignedIn);
//         setUser(userData);
//       } else {
//         setIsSignedIn(false);
//         setUser(null);
//       }
//     };

//     fetchUserSession();
//   }, []);

//   return { isSignedIn, user };
// };

// export default useHonoSession;
