import React from 'react';
import {
    BellIcon,
    CheckCircleIcon,
    ClockIcon,
    WrenchScrewdriverIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const typeIcons = {
    request_assigned: WrenchScrewdriverIcon,
    status_changed: CheckCircleIcon,
    comment_added: ChatBubbleLeftIcon,
    default: BellIcon
};

const typeColors = {
    request_assigned: 'from-blue-500 to-cyan-500',
    status_changed: 'from-green-500 to-emerald-500',
    comment_added: 'from-purple-500 to-pink-500',
    default: 'from-gray-500 to-gray-600'
};

export default function NotificationItem({ notification, onMarkAsRead, onClick }) {
    const Icon = typeIcons[notification.type] || typeIcons.default;
    const gradient = typeColors[notification.type] || typeColors.default;

    const getTimeAgo = (date) => {
        try {
            return formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: es
            });
        } catch (error) {
            return 'Recientemente';
        }
    };

    return (
        <div
            onClick={() => onClick(notification)}
            className={`relative flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all border-b border-gray-100 dark:border-gray-700 ${!notification.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                }`}
        >
            {/* Icon */}
            <div className={`flex-shrink-0 rounded-full p-2 bg-gradient-to-br ${gradient} shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${!notification.isRead
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                        {notification.title}
                    </p>
                    {!notification.isRead && (
                        <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary-600"></div>
                    )}
                </div>

                {notification.message && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                    </p>
                )}

                <div className="mt-1 flex items-center gap-2">
                    <ClockIcon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(notification.createdAt)}
                    </span>
                </div>
            </div>

            {/* Mark as Read Button */}
            {!notification.isRead && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.ID);
                    }}
                    className="flex-shrink-0 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                    Marcar leída
                </button>
            )}
        </div>
    );
}
