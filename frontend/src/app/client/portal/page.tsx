"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home,
    Calendar,
    MessageSquare,
    FileText,
    User,
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    Car,
    Bell,
    ChevronRight,
    AlertCircle
} from 'lucide-react';

export default function ClientPortalPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('home');

    // Mock client data
    const client = {
        name: "Robert Thompson",
        caseId: "LB-2024-0847",
        caseworker: {
            name: "Maria Garcia",
            phone: "(562) 555-0123",
            email: "maria@path.org"
        },
        progress: 65,
        nextAppointment: {
            date: "Tomorrow, 10:00 AM",
            location: "Social Security Office",
            address: "300 Oceangate, Long Beach",
            transportation: "Arranged - Driver: John (562) 555-0199"
        }
    };

    const tasks = [
        { id: 1, title: "Attend SSI Interview", due: "Tomorrow 10:00 AM", status: "pending", priority: "high" },
        { id: 2, title: "Submit Birth Certificate Copy", due: "Jan 8", status: "pending", priority: "medium" },
        { id: 3, title: "Complete Housing Application", due: "Jan 10", status: "in-progress", priority: "high" },
        { id: 4, title: "Mental Health Assessment", due: "Completed", status: "completed", priority: "low" },
    ];

    const messages = [
        { id: 1, from: "Maria Garcia", message: "Great job completing your mental health assessment! Next step is SSI.", time: "2h ago", unread: true },
        { id: 2, from: "System", message: "Transportation confirmed for tomorrow's appointment", time: "5h ago", unread: false },
        { id: 3, from: "Maria Garcia", message: "Don't forget to bring your ID to the SSI interview", time: "1d ago", unread: false },
    ];

    const milestones = [
        { id: 1, title: "Initial Intake", date: "Dec 15, 2024", completed: true },
        { id: 2, title: "Case Plan Created", date: "Dec 18, 2024", completed: true },
        { id: 3, title: "ID Documents Collected", date: "Dec 22, 2024", completed: true },
        { id: 4, title: "Benefits Application Started", date: "In Progress", completed: false },
        { id: 5, title: "Housing Placement", date: "Target: Feb 2025", completed: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">My Journey</h1>
                            <p className="text-sm text-gray-600">Case #{client.caseId}</p>
                        </div>
                        <button className="p-2 relative">
                            <Bell size={24} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
                {activeTab === 'home' && (
                    <div className="space-y-6">
                        {/* Progress Card */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                            <h2 className="text-2xl font-bold mb-2">Welcome back, {client.name.split(' ')[0]}!</h2>
                            <p className="text-blue-100 mb-4">You're making great progress on your journey to stability</p>
                            <div className="bg-white/20 rounded-full h-3 mb-2">
                                <div className="bg-white rounded-full h-3 transition-all" style={{ width: `${client.progress}%` }}></div>
                            </div>
                            <p className="text-sm text-blue-100">{client.progress}% Complete</p>
                        </div>

                        {/* Next Appointment */}
                        {client.nextAppointment && (
                            <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-orange-500">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Calendar className="text-orange-600" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">Next Appointment</h3>
                                        <p className="text-gray-900 font-semibold">{client.nextAppointment.date}</p>
                                        <p className="text-gray-600 text-sm mt-2">{client.nextAppointment.location}</p>
                                        <p className="text-gray-500 text-sm">{client.nextAppointment.address}</p>

                                        {client.nextAppointment.transportation && (
                                            <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                                                <Car className="text-green-600" size={20} />
                                                <div className="text-sm">
                                                    <p className="font-semibold text-green-900">Transportation Arranged</p>
                                                    <p className="text-green-700">{client.nextAppointment.transportation}</p>
                                                </div>
                                            </div>
                                        )}

                                        <button className="mt-4 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors">
                                            Get Directions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tasks */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-lg mb-4">My Tasks</h3>
                            <div className="space-y-3">
                                {tasks.filter(t => t.status !== 'completed').map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.status === 'completed' ? 'bg-green-100' :
                                                task.status === 'in-progress' ? 'bg-blue-100' :
                                                    'bg-gray-200'
                                            }`}>
                                            {task.status === 'completed' ? (
                                                <CheckCircle className="text-green-600" size={20} />
                                            ) : (
                                                <Clock className="text-gray-600" size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{task.title}</p>
                                            <p className="text-sm text-gray-600">{task.due}</p>
                                        </div>
                                        {task.priority === 'high' && (
                                            <AlertCircle className="text-orange-500" size={20} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setActiveTab('messages')}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-center"
                            >
                                <MessageSquare className="mx-auto mb-2 text-blue-600" size={32} />
                                <p className="font-semibold">Message Caseworker</p>
                                {messages.filter(m => m.unread).length > 0 && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                        {messages.filter(m => m.unread).length} new
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('progress')}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-center"
                            >
                                <FileText className="mx-auto mb-2 text-indigo-600" size={32} />
                                <p className="font-semibold">View Progress</p>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-4">
                        <button onClick={() => setActiveTab('home')} className="text-blue-600 font-semibold mb-4">
                            ← Back to Home
                        </button>

                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-lg mb-4">Messages</h3>
                            <div className="space-y-3">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`p-4 rounded-xl ${msg.unread ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-gray-50'}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-semibold text-gray-900">{msg.from}</p>
                                            <p className="text-xs text-gray-500">{msg.time}</p>
                                        </div>
                                        <p className="text-gray-700">{msg.message}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <textarea
                                    placeholder="Type your message to Maria..."
                                    className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    rows={3}
                                />
                                <button className="mt-3 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                                    Send Message
                                </button>
                            </div>
                        </div>

                        {/* Caseworker Contact Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-lg mb-4">Your Caseworker</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="text-blue-600" size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{client.caseworker.name}</p>
                                    <p className="text-gray-600">PATH - Long Beach</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <a href={`tel:${client.caseworker.phone}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                    <Phone className="text-green-600" size={20} />
                                    <span className="font-semibold text-green-900">{client.caseworker.phone}</span>
                                </a>
                                <a href={`mailto:${client.caseworker.email}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                    <MessageSquare className="text-blue-600" size={20} />
                                    <span className="font-semibold text-blue-900">{client.caseworker.email}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="space-y-4">
                        <button onClick={() => setActiveTab('home')} className="text-blue-600 font-semibold mb-4">
                            ← Back to Home
                        </button>

                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-lg mb-6">Your Journey</h3>
                            <div className="space-y-4">
                                {milestones.map((milestone, index) => (
                                    <div key={milestone.id} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                                                }`}>
                                                {milestone.completed ? (
                                                    <CheckCircle className="text-white" size={20} />
                                                ) : (
                                                    <Clock className="text-gray-600" size={20} />
                                                )}
                                            </div>
                                            {index < milestones.length - 1 && (
                                                <div className={`w-0.5 h-12 ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <p className={`font-semibold ${milestone.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {milestone.title}
                                            </p>
                                            <p className="text-sm text-gray-500">{milestone.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Completed Tasks */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="font-bold text-lg mb-4">Completed Tasks</h3>
                            <div className="space-y-2">
                                {tasks.filter(t => t.status === 'completed').map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                        <CheckCircle className="text-green-600" size={20} />
                                        <p className="text-gray-700">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                                }`}
                        >
                            <Home size={24} />
                            <span className="text-xs font-semibold">Home</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${activeTab === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                                }`}
                        >
                            <Calendar size={24} />
                            <span className="text-xs font-semibold">Calendar</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors relative ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                                }`}
                        >
                            <MessageSquare size={24} />
                            <span className="text-xs font-semibold">Messages</span>
                            {messages.filter(m => m.unread).length > 0 && (
                                <span className="absolute top-1 right-6 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${activeTab === 'progress' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                                }`}
                        >
                            <FileText size={24} />
                            <span className="text-xs font-semibold">Progress</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
