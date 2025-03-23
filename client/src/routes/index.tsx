import { HashRouter, Route, Routes } from 'react-router';

import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/login';
import SignUp from '../pages/sign-up';
import Feed from '../pages/feed';
import Onboarding from '../pages/onboarding';
import PostDetails from '../pages/post-details';
import Profile from '../pages/profile';
import Compose from '../pages/compose';
import EditPost from '../pages/edit-post';
import EditProfile from '../pages/edit-profile';
import Search from '../pages/search';

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
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/profile/:email?" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
