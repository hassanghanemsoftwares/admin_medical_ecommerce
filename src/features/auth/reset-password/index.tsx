import { useLocation } from 'react-router-dom';
import ResetPasswordFormComponent from './_components/ResetPasswordFormComponent';

export default function ResetPassword() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  return (
    <>
      {token && email ? (
        <ResetPasswordFormComponent token={token} email={email} />
      ) : (
        <div>Invalid reset link.</div>
      )}
    </>
  );
}
