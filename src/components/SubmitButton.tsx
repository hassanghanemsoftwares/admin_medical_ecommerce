import Spinner from "./spinner";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel: string;
  disabled: boolean
}

export default function SubmitButton({
  children,
  pendingLabel,
  disabled,
}: SubmitButtonProps) {



  return (
    <Button
      type="submit"
      disabled={disabled}
      className={`w-full mt-4 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {disabled ? (
        <>
          {pendingLabel} <Spinner />
        </>
      ) : (
        children
      )}
    </Button>
  );
}
