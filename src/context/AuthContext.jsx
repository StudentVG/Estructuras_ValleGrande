import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, githubProvider } from "../firebase";

const AuthContext = createContext(null);
export default AuthContext;

const BUILD_ID = import.meta.env.VITE_BUILD_ID || "dev";
const BUILD_ID_KEY = "app_build_id";

export function AuthProvider({ children }) {
     const [user, setUser] = useState(undefined);
     const [error, setError] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          const unsub = onAuthStateChanged(auth, (firebaseUser) => {
               setUser(firebaseUser || null);
          });
          return unsub;
     }, []);

     useEffect(() => {
          const storedBuildId = localStorage.getItem(BUILD_ID_KEY);
          if (storedBuildId && storedBuildId !== BUILD_ID) {
               signOut(auth).finally(() => {
                    localStorage.setItem(BUILD_ID_KEY, BUILD_ID);
                    navigate("/plataforma/login", { replace: true });
               });
          } else {
               localStorage.setItem(BUILD_ID_KEY, BUILD_ID);
          }
     }, [navigate]);

     async function loginWithGithub() {
          setError(null);
          try {
               await signInWithPopup(auth, githubProvider);
          } catch (err) {
               if (err.code !== "auth/popup-closed-by-user") {
                    setError("No se pudo iniciar sesi\u00f3n con GitHub. Intenta de nuevo.");
               }
          }
     }

     async function logout() {
          await signOut(auth);
     }

     return (
          <AuthContext.Provider value={{ user, error, loginWithGithub, logout }}>
               {children}
          </AuthContext.Provider>
     );
}
