import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import DashboardHome from '../../pages/Dashboard/DashboardHome';
import Courses from '../../pages/Courses/Courses';
import Profile from '../../pages/Profile/Profile';
import Instructors from '../../pages/Instructors/Instructors';
import Students from '../../pages/Students/Students';

export function getNavigation(role) {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch { }

    const base = [
        {
            path: '/home',
            title: 'Dashboard',
            element: <DashboardHome user={user} />,
            icon: <DashboardIcon />,
        },
        {
            path: '/courses',
            title: 'Courses',
            element: <Courses />,
            icon: <SchoolIcon />,
        },
        {
            path: '/profile',
            title: 'Profile',
            element: <Profile />,
            icon: <PersonIcon />,
        },
    ];

    if (role === 'ADMIN') {
        base.splice(2, 0,
            {
                path: '/instructors',
                title: 'Instructors',
                element: <Instructors />,
                icon: <GroupIcon />,
            },
            {
                path: '/students',
                title: 'Students',
                element: <Students />,
                icon: <GroupIcon />,
            }
        );
    }
    return base;
} 