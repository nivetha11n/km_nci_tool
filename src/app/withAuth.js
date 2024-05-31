// src/app/withAuth.js
import { useSession, signIn } from 'next-auth/react';

const withAuth = (Component) => {
  return (props) => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
      return <p>Loading...</p>;
    }

    if (!session) {
      signIn('microsoft');
      return null; // Or you can show a loader until the user is redirected
    }

    return <Component {...props} session={session} />;
  };
};

export default withAuth;
