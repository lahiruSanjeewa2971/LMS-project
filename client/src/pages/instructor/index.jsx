import { Button } from "../../components/ui/button";
import InstructorCourses from "../../components/instructor-view/courses";
import InstructorDashboard from "../../components/instructor-view/dashboard";
import { BarChart, Book, LogOut } from "lucide-react";

export default function InstructorDashboardPage() {
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        {/** for mobile hidden | larger than medium device - visible */}
        <div className="p-4">
          <h2>Instructor View</h2>

          <nav>
            {menuItems.map((menuItem) => (
                <Button key={menuItem.value}>
                    <menuItem.icon className="mr-2 h-4 w-4" />
                    {menuItem.label}
                </Button>
            ))}
          </nav>
          
        </div>
      </aside>
    </div>
  );
}
