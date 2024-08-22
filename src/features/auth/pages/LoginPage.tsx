import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from "/src/assets/logo.png";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FormDataType } from "../types/FormDataType";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect } from "react";

function LoginPage() {
  const currentSession = useAuthStore((state) => state.session);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentSession) {
      navigate("/dashboard");
    }
  }, [currentSession]);

  const setSession = useAuthStore((state) => state.setSession);
  const schema = z.object({
    email: z.string().email({
      message: "Invalid email",
    }),
    password: z.string().min(6),
  });

  async function onSubmit(data: FormDataType) {
    try {
      const session = await login(data);
      if (session) {
        setSession(session);
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
    }
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100">
      <div className="hidden h-full basis-1/2 items-center justify-center bg-green-300/20 md:flex">
        <div className="mb-20 h-48 w-48">
          <LazyLoadImage
            src={logo}
            alt="Logo"
            className="block h-full w-full object-cover"
            effect="opacity"
          />
        </div>
      </div>
      <div className="flex h-full basis-full flex-col items-center justify-center gap-5 px-3 md:basis-1/2">
        <h1 className="text-2xl font-bold">Green Haven</h1>
        <p className="text-lg text-slate-600">
          Enter your credentials to login
        </p>
        <form
          className="flex w-full max-w-md flex-col gap-5 *:flex *:flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl isInvalid={errors?.email ? true : false}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register("email")} />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors?.password ? true : false}>
            <FormLabel>Password</FormLabel>
            <Input type="password" {...register("password")} />
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors?.root ? true : false}>
            <FormErrorMessage>{errors?.root?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="green">
            {isSubmitting ? "Submitting..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
