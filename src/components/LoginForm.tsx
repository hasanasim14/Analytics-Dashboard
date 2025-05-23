"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { toast } from "@/components/ui/use-toast";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });
  const router = useRouter();

  // Check for existing auth token on mount
  // useEffect(() => {
  //   const token = sessionStorage.getItem("authToken");
  //   if (token) {
  //     router.push("/dashboard");
  //   }
  // }, [router]);

  // Email validation helper
  const isValidEmail = useCallback((email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Validate on change
    if (id === "email") {
      setErrors((prev) => ({
        ...prev,
        email:
          value.trim() === ""
            ? "Email is required"
            : // : !isValidEmail(value)
              // ? "Invalid email format"
              "",
      }));
    } else if (id === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value.trim() === "" ? "Password is required" : "",
      }));
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email:
        formData.email.trim() === ""
          ? "Email is required"
          : // : !isValidEmail(formData.email)
            // ? "Invalid email format"
            "",
      password: formData.password.trim() === "" ? "Password is required" : "",
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      // toast({
      //   title: "Validation Error",
      //   description: "Please fix the errors in the form",
      //   variant: "destructive",
      // });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: formData.email,
            secret: formData.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Invalid email or password"
            : "Login failed. Please try again."
        );
      }

      const responseData = await response.json();

      // Store auth token and user data
      const authToken = responseData?.data?.token;
      if (authToken) {
        sessionStorage.setItem("authToken", authToken);
        sessionStorage.setItem(
          "user",
          JSON.stringify(responseData?.data?.token_payload || {})
        );
      }

      // toast({
      //   title: "Login Successful",
      //   description: "Redirecting to dashboard...",
      // });

      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      // toast({
      //   title: "Error",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
