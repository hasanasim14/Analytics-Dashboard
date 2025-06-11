"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
  });
  const router = useRouter();

  // Check for existing auth token on mount
  useEffect(() => {
    const userStatus = sessionStorage.getItem("LoggedIn");
    if (userStatus === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Validate on change
    if (id === "username") {
      setErrors((prev) => ({
        ...prev,
        email: value.trim() === "" ? "Username is required" : "",
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
      username: formData.username.trim() === "" ? "Username is required" : "",
      password: formData.password.trim() === "" ? "Password is required" : "",
    };

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
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
            user: formData.username,
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

      const userStatus = responseData?.success;
      sessionStorage.setItem("LoggedIn", userStatus);
      sessionStorage.setItem("Key", responseData?.data?.token);
      toast.success("Login Successful");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      toast.error("Failed to Login, try again at a later time");
      console.error("Login error:", errorMessage);
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
            Enter your credentials below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-destructive text-sm">{errors.username}</p>
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
              disabled={isLoading || !formData.username || !formData.password}
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
