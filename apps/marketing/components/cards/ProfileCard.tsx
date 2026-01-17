'use client';

import * as React from 'react';
import { useState } from 'react';

interface ProfileCardProps {
    name: string;
    title: string;
    handle: string;
    status?: 'Online' | 'Offline' | 'Away';
    contactText?: string;
    avatarUrl: string;
    showUserInfo?: boolean;
    enableTilt?: boolean;
    enableMobileTilt?: boolean;
    onContactClick?: () => void;
}

export default function ProfileCard({
    name,
    title,
    handle,
    status = 'Offline',
    contactText = 'Contact',
    avatarUrl,
    showUserInfo = true,
    enableTilt = true,
    enableMobileTilt = false,
    onContactClick
}: ProfileCardProps): React.JSX.Element {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableTilt) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top - rect.height / 2) / 10;
        const y = -(e.clientX - rect.left - rect.width / 2) / 10;

        setTilt({ x, y });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const statusColor = {
        Online: 'bg-green-500',
        Away: 'bg-yellow-500',
        Offline: 'bg-gray-500'
    }[status];

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
            className="rounded-lg border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
            <div className="flex flex-col items-center space-y-4">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="size-24 rounded-full border-4 border-neutral-200 object-cover dark:border-neutral-800"
                    />
                    {status && (
                        <div className={`absolute bottom-2 right-2 size-4 rounded-full border-2 border-white ${statusColor} dark:border-neutral-900`} />
                    )}
                </div>

                {/* User Info */}
                {showUserInfo && (
                    <div className="space-y-2 text-center">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                            {name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {title}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                            @{handle}
                        </p>
                    </div>
                )}

                {/* Contact Button */}
                {contactText && (
                    <button
                        onClick={onContactClick}
                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {contactText}
                    </button>
                )}
            </div>
        </div>
    );
}
