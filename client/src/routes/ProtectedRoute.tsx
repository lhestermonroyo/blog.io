import { Navigate, Outlet } from 'react-router';
import { useRecoilValue } from 'recoil';
import states from '../states';

const ProtectedRoute = () => {
  const auth = useRecoilValue(states.auth);

  if (auth.isAuth) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
