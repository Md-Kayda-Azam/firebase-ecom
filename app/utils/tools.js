import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { auth, firebaseApp } from "../firebase";


const db = getFirestore(firebaseApp)
export const imageDb = getStorage(firebaseApp);
// get product function
export const getDataRealTime = async () => {
    const productsCollection = collection(db, "products");

    const unsubscribe = onSnapshot(productsCollection, (querySnapshot) => {
        const productsData = [];
        querySnapshot.forEach((doc) => {
            productsData.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // console.log("Real-time data: ", productsData);
        return productsData
    });
    return unsubscribe
};


