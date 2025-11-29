import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';

export default function NotificationCenter({ notifications = [], onMarkAsRead, onMarkAllAsRead, isLoading }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.isRead) {
            onMarkAsRead(notification.ID);
        }

        // Navigate to related request
        if (notification.relatedRequest?.ID) {
            navigate(`/requests?highlight=${notification.relatedRequest.ID}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Icon Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                title="Notificaciones"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-96 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Notificaciones
                            </h3>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {unreadCount} sin leer
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={onMarkAllAsRead}
                                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center gap-1"
                                    title="Marcar todas como leídas"
                                >
                                    <CheckIcon className="h-4 w-4" />
                                    Marcar todas
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6">
                                <BellIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    No tienes notificaciones
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.ID}
                                        notification={notification}
                                        onMarkAsRead={onMarkAsRead}
                                        onClick={handleNotificationClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3">
                            <button
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                            >
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
