import { Navigate, Outlet } from 'react-router';
import { useRecoilValue } from 'recoil';
import states from '../states';

const PublicRoute = () => {
  const auth = useRecoilValue(states.auth);

  if (auth.isAuth === null) {
    return null;
  }

  return auth.isAuth ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
