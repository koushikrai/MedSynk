import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Ambulance, Map, Building2, Activity } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const { isHospitalStaff, signOut } = useAuth();

  const links = [
    ...(isHospitalStaff
      ? [{ to: "/management", icon: Building2, label: "Hospital Management" }]
      : [
          { to: "/", icon: Ambulance, label: "New Emergency" },
          { to: "/map", icon: Map, label: "Hospital Map" },
          { to: "/status", icon: Activity, label: "Patient Status" },
        ]),
  ];

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === to
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={signOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
