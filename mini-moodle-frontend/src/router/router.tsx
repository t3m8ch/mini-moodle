import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';

export const appRouter = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        lazy: {
          Component: async () =>
            (await import('../components/wrappers/CommonWrapper'))
              .CommonWrapper,
        },
        children: [
          {
            path: '/',
            lazy: {
              Component: async () =>
                (await import('../pages/LandingPage')).LandingPage,
            },
          },
          {
            path: '/login',
            lazy: {
              Component: async () =>
                (await import('../pages/LoginPage')).LoginPage,
            },
          },
          {
            path: '/register',
            lazy: {
              Component: async () =>
                (await import('../pages/RegisterPage')).RegisterPage,
            },
          },
          {
            lazy: {
              Component: async () =>
                (await import('../components/wrappers/AuthWrapper'))
                  .AuthWrapper,
            },
            children: [
              {
                lazy: {
                  Component: async () =>
                    (await import('../components/layout/AppLayout')).AppLayout,
                },
                children: [
                  {
                    path: '/dashboard',
                    lazy: {
                      Component: async () =>
                        (await import('../pages/DashboardPage')).DashboardPage,
                    },
                  },
                  {
                    path: '/profile',
                    lazy: {
                      Component: async () =>
                        (await import('../pages/ProfilePage')).ProfilePage,
                    },
                  },
                  {
                    path: '/courses/:courseId',
                    lazy: {
                      Component: async () =>
                        (await import('../pages/CoursePage')).CoursePage,
                    },
                  },
                  {
                    path: '/assignments/:assignmentId',
                    lazy: {
                      Component: async () =>
                        (await import('../pages/AssignmentPage'))
                          .AssignmentPage,
                    },
                  },
                  {
                    path: '/progress',
                    lazy: {
                      Component: async () =>
                        (await import('../pages/ProgressPage')).ProgressPage,
                    },
                  },
                ],
              },
            ],
          },
          {
            path: '*',
            lazy: {
              Component: async () =>
                (await import('../pages/NotFoundPage')).NotFoundPage,
            },
          },
        ],
      },
    ],
  },
]);
