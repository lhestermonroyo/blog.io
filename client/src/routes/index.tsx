import { HashRouter, Route, Routes } from 'react-router';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/login';
import SignUp from '../pages/sign-up';
import Feed from '../pages/feed';
import PostDetails from '../pages/post-details';
import Profile from '../pages/profile';
import Compose from '../pages/compose';
import EditPost from '../pages/edit-post';

const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        {/*  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
