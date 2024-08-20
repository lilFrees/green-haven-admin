import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from "/public/logo.png";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex h-full basis-1/2 items-center justify-center bg-zinc-300">
        <div className="mb-20 h-48 w-48">
          <LazyLoadImage
            src={logo}
            alt="Logo"
            className="block h-full w-full object-cover"
            effect="opacity"
          />
        </div>
      </div>
      <div className="flex h-full basis-1/2 flex-col items-center justify-center gap-5 bg-zinc-200">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-lg text-slate-600">
          Enter your credentials to login
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register("password")} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
