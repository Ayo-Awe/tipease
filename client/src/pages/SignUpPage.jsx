import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <SignUp
        redirectUrl={"/complete-page"}
        path="/sign-up"
        signInUrl="/sign-in"
        routing="path"
      />
    </div>
  );
};

export default SignUpPage;
