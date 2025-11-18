/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, type ReactNode } from "react";
import { eraseCookie } from "../utils/functions";

type AnyObject = Record<string, unknown>;

interface AuthContextType {
    user: AnyObject | null;
    login: (userData: AnyObject) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AnyObject | null>(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const login = (userData: AnyObject) => {
        // keep full user in memory for app use
        setUser(userData);
        // but persist only minimal info to localStorage: name and access_token (if present)
        const minimal: AnyObject = {};
        if (typeof userData === "object" && userData !== null) {
            if (Object.prototype.hasOwnProperty.call(userData, "name")) {
                minimal["name"] = (userData as AnyObject)["name"];
            }
            if (Object.prototype.hasOwnProperty.call(userData, "access_token")) {
                minimal["access_token"] = (userData as AnyObject)["access_token"];
            }
        }
        localStorage.setItem("user", JSON.stringify(minimal));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        // remove tokens from cookies if present
        try {
            eraseCookie("access_token");
            eraseCookie("refresh_token");
        } catch {
            // ignore
        }
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext)!;
