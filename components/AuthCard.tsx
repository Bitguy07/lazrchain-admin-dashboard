// components/AuthCard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSignupMutation, useSigninMutation, useVerifyAuthQuery } from "@/reduxElement/RTK_Queries/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIsSignup, setLogin, setAdminemail } from "@/reduxElement/Slices/auth";
import { useRouter } from 'next/navigation';


interface AuthCardProps {
  mode: "signup" | "login";
}

const AuthCard: React.FC<AuthCardProps> = ({ mode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { toast } = useToast();
  const { isSignup, isLoggedIn } = useAppSelector((state) => state.auth);

  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signup] = useSignupMutation();
  const [login] = useSigninMutation();
  const { data, isLoading, isError } = useVerifyAuthQuery();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    useEffect(() => {
    if (!isLoading && data?.isAuthenticated) {
      router.replace('/lazrchain-dashboard'); 
    }
  }, [isLoading, data]);

  useEffect(() => {

    if (isSignup) {
      router.push('/login');
    }
  }, [isSignup]);

  const validateCommonFields = () => {
    if (!adminEmail || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
        duration: 3000,
      });
      return false;
    }
    if (!emailRegex.test(adminEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        duration: 3000,
      });
      return false;
    }
    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateCommonFields()) return;

    if (!confirmPassword) {
      toast({
        variant: "destructive",
        title: "Confirm Password Required",
        description: "Please confirm your password.",
        duration: 3000,
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match.",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await signup({
        email: adminEmail,
        password,
        confirmPassword,
      }).unwrap();

      dispatch(setAdminemail(response.email));
      dispatch(setIsSignup(true));
      router.push('/login');

      setTimeout(() => {
        toast({
          title: "Account Created",
          description: `Login to continue, ${response.email}!`,
          duration: 3000,
        });
      }, 1000);
    } catch (error: any) {
    const backendError = error?.data;

    const toastMap: Record<string, { title: string; description: string }> = {
    MISSING_FIELDS: {
        title: "Missing Fields :(",
        description: "Please fill out all required fields.",
    },
    INVALID_EMAIL: {
        title: "Invalid Email",
        description: "Please enter a valid email address.",
    },
    PASSWORD_MISMATCH: {
        title: "Password Mismatch",
        description: "Passwords do not match.",
    },
    PASSWORD_TOO_SHORT: {
        title: "Password Too Short",
        description: "Password must be at least 8 characters.",
    },
    USER_EXISTS: {
        title: "User Exists",
        description: "An account with this email already exists.",
    },
    SERVER_ERROR: {
        title: "Server Error",
        description: "An unexpected error occurred. Please try again.",
    },
    };

    const toastContent =
    toastMap[backendError?.type as string] ?? {
        title: "Signup Error",
        description: "Something went wrong. Please try again.",
    };

    toast({
    variant: "destructive",
    title: toastContent.title,
    description: toastContent.description,
    duration: 3000,
    });
    }
  };

  const handleSignin = async () => {
    if (!validateCommonFields()) return;

    try {
      const response = await login({ email: adminEmail, password }).unwrap();
      dispatch(setLogin({ email: response.email }));
      router.push('/lazrchain-dashboard');
      setTimeout(() => {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${adminEmail}!`,
          duration: 3000,
        });
      }, 1000);
    } catch (error: any) {
      const backendError = error?.data;
        const toastMap: Record<string, { title: string; description: string }> = {
        INVALID_CREDENTIALS: {
            title: "Login Failed",
            description: "Email or password is incorrect.",
        },
        SERVER_ERROR: {
            title: "Server Error",
            description: "Something went wrong. Please try again.",
        },
        };

        const toastContent =
        toastMap[backendError?.type as string] ?? {
            title: "Login Error",
            description: "An error occurred. Please try again.",
        };

      toast({
        variant: "destructive",
        title: toastContent.title,
        description: toastContent.description,
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-dark">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-primary rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-secondary rounded-full opacity-20 animate-bounce" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary rounded-full opacity-10 animate-spin" style={{ animationDuration: "20s" }} />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-warning to-warning rounded-lg opacity-20 animate-ping" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md glass border-primary/20 shadow-glow">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-gradient">LazrChain</span>
            </div>
            <CardTitle className="text-2xl text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {mode === "login"
                ? "Sign in to your dashboard"
                : "Join LazrChain and start earning"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="glass border-primary/30 text-foreground placeholder:text-gray-300"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass border-primary/30 text-foreground placeholder:text-gray-300"
            />

            {mode === "signup" && (
              <>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass border-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </>
            )}

            <Button
              onClick={mode === "login" ? handleSignin : handleSignup}
              className="w-full btn-crypto text-sm py-2 sm:py-3 shadow-glow"
            >
              {mode === "login" ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Create Account
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCard;
