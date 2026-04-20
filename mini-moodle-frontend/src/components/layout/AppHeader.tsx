import { ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/thunks';

export function AppHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch {
      // Global error UI is handled in CommonWrapper.
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <h1 className="text-lg font-semibold text-slate-900">mini-Moodle</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt={currentUser?.fullName ?? 'Пользователь'}
                  src=""
                />
                <AvatarFallback>
                  {currentUser?.avatarFallback ?? 'MM'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {currentUser?.fullName ?? 'Пользователь'}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              <UserCircle className="mr-2 h-4 w-4" />
              Профиль
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
