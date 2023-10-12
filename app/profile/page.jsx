'use client';
import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import Image from 'next/image';

const Profile = () => {
    const route = useRouter();
    const [user, setUser] = useState(null);
    console.log(user);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                route.push('/profile');
                setUser(user);
            } else {
                route.push('/login');
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [route]);

    return (
        <div>
            <Topbar />
            <div className="w-full he-full">
                <div className='flex flex-col justify-center items-center mt-10'>
                    <h1>Profile Page Just seen this page</h1>
                    <div className='py-10'>
                        {
                            user?.photoURL &&
                            <Image src={user?.photoURL} alt="photo" width={100} height={100} />
                        }

                    </div>
                    <div>
                        <h3>{user?.displayName ? "Name" : "Email"}: {user?.displayName ? user?.displayName : user?.email}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
