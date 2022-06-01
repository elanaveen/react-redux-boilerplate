import Dashboard from '../layouts/dashboard';
import Profile from '../layouts/profile';
const AuthRoutes = [{
    id: 0,
    title: 'Dashboard',
    icon: '',
    ismenu: true,
    menu: 'dashboard',
    path: '/dashboard',
    roles: ['admin', 'user'],
    component: <Dashboard />
}, {
    id: 1,
    title: 'Profile',
    icon: '',
    ismenu: true,
    menu: 'profile',
    path: '/profile',
    roles: ['admin'],
    component: <Profile />
}];

export default AuthRoutes