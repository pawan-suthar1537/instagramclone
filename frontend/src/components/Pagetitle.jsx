import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();
  console.log("adfsdfsd",location);

  useEffect(() => {
    const titles = {
      "/": "Home - Instagram Clone",
      "/login": "Login - Instagram Clone",
      "/signup": "Signup - Instagram Clone",
      "/profile": "Edit Profile - Instagram Clone",
      "/chat": "Chat - Instagram Clone",
      // Add more routes here as needed
    };

    const title = titles[location.pathname] || "Instagram Clone";
    document.title = title;
  }, [location]);

  return null;
};

export default PageTitle;
