"use client"
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { auth, firebaseApp } from "@/app/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function HomePage() {
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


    //products data state
    const [products, setProducts] = useState([]); // Your data state
    const db = getFirestore(firebaseApp)
    // get product function
    const getDataRealTime = useCallback(() => {
        const productsCollection = collection(db, "products");

        const unsubscribe = onSnapshot(productsCollection, (querySnapshot) => {
            const productsData = [];
            querySnapshot.forEach((doc) => {
                productsData.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            setProducts(productsData)
            return productsData
        });
        return unsubscribe
    }, [db]);


    useEffect(() => {
        getDataRealTime()
    }, [getDataRealTime]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">All Products </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product, index) => (
                        <Link href={`/${product.id}`} key={index}>
                            <div key={product.id} className="group relative">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <img
                                        src={product.photo}
                                        alt="photo"
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />

                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <a href={product.href}>
                                                <span aria-hidden="true" className="absolute inset-0" />
                                                {product.name}
                                            </a>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
