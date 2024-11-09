import { Button } from "../../../components/ui/button";
import { AuthContext } from "../../../context/auth-context";
import React, { useContext } from "react";

function StudentHomePage() {
  const { resetCredentials } = useContext(AuthContext);

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

  return (
    <div>
      StudentHomePage
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default StudentHomePage;
