import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { userProfile } from '../services/firebase/db';

const AuthContext = createContext(null);
const reducer = (s, a) => ({ ...s, ...a });

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null, profile: null, loading: true });

  useEffect(() => {
    let unsubProfile = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubProfile();
      if (!user) { dispatch({ user: null, profile: null, loading: false }); return; }
      dispatch({ user, loading: true });
      // Live profile: role changes made by an admin apply without re-login.
      unsubProfile = userProfile(user.uid,
        (profile) => dispatch({ profile, loading: false }),
        () => dispatch({ profile: null, loading: false }));
    });
    return () => { unsubAuth(); unsubProfile(); };
  }, []);

  const value = useMemo(() => ({ ...state, isAdmin: state.profile?.role === 'admin' }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
