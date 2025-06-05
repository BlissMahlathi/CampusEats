import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface ProtectedProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ADMIN_EMAIL = "blissmahlathi@gmail.com"; // Your specific admin email

const Protected = ({ children, allowedRoles }: ProtectedProps) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication is complete and there's no user, redirect to login
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    // Special check for ADMIN role - only allow specified email
    if (
      !isLoading &&
      user &&
      profile &&
      allowedRoles?.includes(UserRole.ADMIN) &&
      profile.email !== ADMIN_EMAIL
    ) {
      // If trying to access admin route but not the approved admin email
      navigate("/dashboard", { replace: true });
      return;
    }

    // General role check
    if (
      !isLoading &&
      user &&
      profile &&
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(profile.role)
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, user, profile, allowedRoles, navigate]);

  // Show loading while checking authentication status
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-xl px-8 py-12 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold text-primary-700 dark:text-primary-300">
            Loading...
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-xs">
            Please wait while we check your authentication status.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
