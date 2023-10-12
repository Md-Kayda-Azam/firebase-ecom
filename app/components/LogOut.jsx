"use client"
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/app/firebase";

const LogOut = () => {

    const route = useRouter();
    const [user, setUser] = useState(null);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                route.push("/");
                setUser(user)
            } else {
                route.push("/login");
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [route]);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {

                route.push("/login");
            })
            .catch((error) => {
                alert(error.message);
            });
    };


    return (
        <div>
            <h1>Email: {user?.email}</h1>
            <button className="p-2 bg-green-500 rounded-md" onClick={handleSignOut}>Log Out</button>
        </div>
    );
};

export default LogOut;







