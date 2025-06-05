import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Login error:", error);
      } else {
        toast({
          title: "Login successful",
          description: "You are now logged in",
          variant: "default",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-2 py-8 bg-gradient-to-br from-primary-50 via-white to-secondary-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary-700 dark:text-primary-300">
              Login
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 dark:text-gray-300">
              Sign in to your CampusEats account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-2 text-lg font-semibold rounded-lg shadow bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-700 dark:hover:bg-primary-800"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary-500 hover:underline font-medium"
                >
                  Register
                </Link>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Want to become a vendor?{" "}
                <Link
                  to="/vendor/register"
                  className="text-primary-500 hover:underline font-medium"
                >
                  Apply here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Login;
