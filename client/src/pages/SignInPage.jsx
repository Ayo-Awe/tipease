import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <SignIn
        signUpUrl="/sign-up"
        routing="path"
        redirectUrl="/"
        path="/sign-in"
      />
    </div>
  );
};

export default SignInPage;
