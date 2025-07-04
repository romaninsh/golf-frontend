import { useMemo, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, loginWithRedirect, logout } = useAuth0();

  const isAdmin = useMemo(() => {
    return isAuthenticated && !!user;
  }, [isAuthenticated, user]);

  const login = useCallback(
    (options) => {
      loginWithRedirect({
        authorizationParams: {
          scope: "openid profile email",
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
        ...options,
      });
    },
    [loginWithRedirect],
  );

  const handleLogout = useCallback(
    async (options) => {
      try {
        const returnTo = window.location.origin;
        console.log("Logging out with returnTo:", returnTo);
        await logout({
          logoutParams: {
            returnTo,
          },
          ...options,
        });
      } catch (error) {
        console.error("Logout error:", error);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = window.location.origin;
      }
    },
    [logout],
  );

  const localLogout = useCallback(() => {
    try {
      localStorage.removeItem(
        `@@auth0spajs@@::${import.meta.env.VITE_AUTH0_CLIENT_ID}::${import.meta.env.VITE_AUTH0_DOMAIN}::openid profile email`,
      );
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = window.location.origin;
    } catch (error) {
      console.error("Local logout error:", error);
      window.location.reload();
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    login,
    logout: handleLogout,
    localLogout,
  };
};
