import Home from '../layouts/home';
import QueryThread from '../layouts/query';
import Forums from '../layouts/forums';
import Forum from '../layouts/forum';
import Search from '../layouts/search';
import Profile from '../layouts/profile';

const AuthRoutes = [{
    id: 0,
    title: 'Home',
    path: '/home',
    roles: ['student'],
    component: <Home />
}, {
    id: 1,
    title: 'Query',
    path: '/query/:queryId',
    roles: ['student'],
    component: <QueryThread />
}, {
    id: 2,
    title: 'Forums',
    path: '/forums',
    roles: ['student'],
    component: <Forums />
}, {
    id: 3,
    title: 'Forum',
    path: '/forum/:forumId',
    roles: ['student'],
    component: <Forum />
}, {
    id: 4,
    title: 'Search',
    path: '/search',
    roles: ['student'],
    component: <Search />
}, {
    id: 5,
    title: 'Profile',
    path: '/profile',
    roles: ['student'],
    component: <Profile />
}];

export default AuthRoutes
