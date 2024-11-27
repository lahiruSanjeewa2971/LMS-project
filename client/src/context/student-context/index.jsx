import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentCoursesList, setStudentCoursesList] = useState([]);

  return (
    <StudentContext.Provider
      value={{ studentCoursesList, setStudentCoursesList }}
    >
      {children}
    </StudentContext.Provider>
  );
}
