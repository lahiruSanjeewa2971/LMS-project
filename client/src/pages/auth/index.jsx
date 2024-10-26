import { signInFormControls, signUpFormControls } from "../../config";
import CommonForm from "../../components/common-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { GraduationCap } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
      </header>

      <div className="flex items-center justify-center min-h-screen ">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account.</CardTitle>
              </CardHeader>
              <CardContent>
                <CommonForm formControls={signInFormControls} buttonText={"Sign In"} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
          <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account.</CardTitle>
              </CardHeader>
              <CardContent>
                <CommonForm formControls={signUpFormControls} buttonText={"Sign Up"} />
              </CardContent>
            </Card>
            {/* <CommonForm formControls={signUpFormControls} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
