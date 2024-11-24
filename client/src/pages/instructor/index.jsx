import { Button } from "../../components/ui/button";
import InstructorCourses from "../../components/instructor-view/courses";
import InstructorDashboard from "../../components/instructor-view/dashboard";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { AuthContext } from "../../context/auth-context";
import { InstructorContext } from "../../context/instructor-context";
import { fetchInstructorCourseListService } from "../../services";

export default function InstructorDashboardPage() {
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  const [activeTab, setActiveTab] = useState("dashboard");

  const fetchAllCourses = async () => {
    const response = await fetchInstructorCourseListService();

    if (response.success) {
      setInstructorCoursesList(response?.data);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

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
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        {/** for mobile hidden | larger than medium device - visible */}
        <div className="p-4">
          <h2>Instructor View</h2>

          <nav>
            {menuItems.map((menuItem) => (
              <Button
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
                key={menuItem.value}
                className="w-full justify-start mb-2"
                varient={activeTab === menuItem.value ? "secondary" : "ghost"}
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
