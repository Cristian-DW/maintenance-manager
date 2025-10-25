import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  WrenchIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Maintenance Requests', href: '/requests', icon: ClipboardDocumentListIcon },
  { name: 'Assets', href: '/assets', icon: WrenchIcon },
  { name: 'Team', href: '/team', icon: UserGroupIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser] = useState({
    name: 'John Doe',
    role: 'Manager',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Dialog as="div" className="lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white px-4 pb-6 pt-5 sm:max-w-sm sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img className="h-8 w-auto" src="/logo.svg" alt="Maintenance Manager" />
              <span className="text-xl font-semibold text-gray-900">Maintenance Manager</span>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    <item.icon className="h-6 w-6 mr-3 text-gray-400" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <div className="flex items-center gap-x-4 p-4 text-sm font-semibold leading-6 text-gray-900">
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={currentUser.imageUrl}
                    alt=""
                  />
                  <div className="flex-1">
                    <div>{currentUser.name}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                </div>
                <a
                  href="#"
                  className="mt-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img className="h-8 w-auto" src="/logo.svg" alt="Maintenance Manager" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Maintenance Manager</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      >
                        <item.icon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600" aria-hidden="true" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={currentUser.imageUrl}
                    alt=""
                  />
                  <div className="flex-1">
                    <div>{currentUser.name}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                </div>
                <a
                  href="#"
                  className="mt-3 block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5"
                  id="user-menu-button"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={currentUser.imageUrl}
                    alt=""
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                      {currentUser.name}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
