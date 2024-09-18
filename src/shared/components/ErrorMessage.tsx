function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-5 text-center">
      <h2 className="text-3xl font-bold">Ooops 😔</h2>
      <p className="text-lg">{message}</p>
    </div>
  );
}

export default ErrorMessage;
