// components/component/withAuth.js
"use client";
import { useRouter } from "next/router";
export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    return isAuthenticated ? <Component {...props} /> : null;
  };
}
