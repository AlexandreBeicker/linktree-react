import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/home'
import { Admin } from './pages/admin'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { Networks } from './pages/networks'
import { ToDoList } from './pages/todolist'
import { ErrorPage } from './pages/error'
import { Private } from './routes/Private'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/todolist',
    element: <Private><ToDoList/></Private>
  },
  {
    path: '/admin',
    element: <Private><Admin/></Private>
  },
  {
    path: '/admin/social',
    element: <Private><Networks/></Private>
  }, 
  {
    path: '/:userId', 
    element: <Home />
  },
  {
    path: "*",
    element: <ErrorPage/>
  }
])

export { router };