import React, { useState, useEffect } from 'react';
import {
    Users,
    Building2,
    BookOpen,
    TrendingUp,
    Eye,
    MessageSquare,
    Calendar,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
} from 'lucide-react';
import { theme } from '../utils/constants';

interface StatCard {
    id: string;
    title: string;
    value: string;
    change: number;
    changeType: 'increase' | 'decrease';
    icon: React.ReactNode;
    color: string;
}

interface RecentActivity {
    id: string;
    type: 'user' | 'business' | 'announcement' | 'program';
    title: string;
    description: string;
    time: string;
    avatar?: string;
}

interface ChartData {
    name: string;
    users: number;
    businesses: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<StatCard[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Simulate API data loading
    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock stats data
            setStats([
                {
                    id: 'total-users',
                    title: 'Total Users',
                    value: '12,847',
                    change: 12.5,
                    changeType: 'increase',
                    icon: <Users className="h-6 w-6" />,
                    color: theme.secondary
                },
                {
                    id: 'businesses',
                    title: 'Registered Businesses',
                    value: '2,431',
                    change: 8.3,
                    changeType: 'increase',
                    icon: <Building2 className="h-6 w-6" />,
                    color: theme.primary
                },
                {
                    id: 'library-items',
                    title: 'Library Items',
                    value: '8,392',
                    change: 15.2,
                    changeType: 'increase',
                    icon: <BookOpen className="h-6 w-6" />,
                    color: '#3b82f6'
                },
                {
                    id: 'active-programs',
                    title: 'Active Programs',
                    value: '147',
                    change: -2.1,
                    changeType: 'decrease',
                    icon: <TrendingUp className="h-6 w-6" />,
                    color: '#10b981'
                }
            ]);

            // Mock recent activities
            setRecentActivities([
                {
                    id: '1',
                    type: 'user',
                    title: 'New User Registration',
                    description: 'Ahmed Hassan joined the platform',
                    time: '2 minutes ago'
                },
                {
                    id: '2',
                    type: 'business',
                    title: 'Business Verification',
                    description: 'Al-Noor Islamic Center was verified',
                    time: '15 minutes ago'
                },
                {
                    id: '3',
                    type: 'announcement',
                    title: 'New Announcement',
                    description: 'Ramadan schedule updated',
                    time: '1 hour ago'
                },
                {
                    id: '4',
                    type: 'program',
                    title: 'Program Launch',
                    description: 'Quran recitation course started',
                    time: '3 hours ago'
                },
                {
                    id: '5',
                    type: 'user',
                    title: 'Prayer Time Update',
                    description: 'Monthly prayer times synchronized',
                    time: '5 hours ago'
                }
            ]);

            // Mock chart data
            setChartData([
                { name: 'Jan', users: 400, businesses: 80 },
                { name: 'Feb', users: 550, businesses: 95 },
                { name: 'Mar', users: 720, businesses: 110 },
                { name: 'Apr', users: 890, businesses: 125 },
                { name: 'May', users: 1020, businesses: 140 },
                { name: 'Jun', users: 1150, businesses: 155 }
            ]);

            setIsLoading(false);
        };

        loadDashboardData();
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user': return <Users className="h-4 w-4" />;
            case 'business': return <Building2 className="h-4 w-4" />;
            case 'announcement': return <MessageSquare className="h-4 w-4" />;
            case 'program': return <Calendar className="h-4 w-4" />;
            default: return <Eye className="h-4 w-4" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'user': return theme.secondary;
            case 'business': return theme.primary;
            case 'announcement': return '#3b82f6';
            case 'program': return '#10b981';
            default: return '#6b7280';
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                {/* Loading skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-600">
                            Welcome back! Here's what's happening with your Islamic platform.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-3">
                        <div
                            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                            style={{ backgroundColor: theme.secondary }}
                        >
                            السلام عليكم
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: stat.color + '15' }}
                            >
                                <div style={{ color: stat.color }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className={`flex items-center text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.changeType === 'increase' ? (
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                )}
                                {Math.abs(stat.change)}%
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                        <p className="text-gray-600 text-sm">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts and Activities Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Simple Chart Visualization */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Growth Overview</h2>
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                        {chartData.map((data) => (
                            <div key={data.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{data.name}</span>
                                    <span className="text-gray-800 font-medium">{data.users + data.businesses}</span>
                                </div>
                                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(data.users / 1200) * 100}%`,
                                            backgroundColor: theme.secondary
                                        }}
                                    />
                                    <div
                                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(data.businesses / 1200) * 100}%`,
                                            backgroundColor: theme.primary,
                                            marginLeft: `${(data.users / 1200) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: theme.secondary }}
                            />
                            <span className="text-sm text-gray-600">Users</span>
                        </div>
                        <div className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: theme.primary }}
                            />
                            <span className="text-sm text-gray-600">Businesses</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                        <Clock className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div
                                    className="p-2 rounded-lg flex-shrink-0"
                                    style={{ backgroundColor: getActivityColor(activity.type) + '15' }}
                                >
                                    <div style={{ color: getActivityColor(activity.type) }}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="w-full mt-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        View All Activities
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;