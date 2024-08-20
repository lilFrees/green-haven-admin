import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <div className="text-xl">Ooops 🫢</div>
      <p>Something unexpected happened</p>
    </div>
  );
}

export default ErrorPage;
