"use client"
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import Modal from 'react-modal';
import { firebaseApp } from "@/app/firebase";
import Image from 'next/image';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from "uuid";
import { imageDb } from '../utils/tools';
import { useState } from 'react';


const ProductAdd = ({ closeModal, modalIsOpen }) => {

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '0%',
            transform: 'translate(-50%, -50%)',
        },
    };

    /// photo manage state
    const [img, setImg] = useState("")
    const [imgs, setImgs] = useState([])
    const [photo, setPhoto] = useState("")
    const [loader, setLoader] = useState(false)

    // const [input, setInput] = useState({
    //     name: "",
    //     price: "",
    //     brand: "",
    //     tag: "",
    //     color: "",
    // })

    const db = getFirestore(firebaseApp)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)

        const name = e.target.name.value
        const price = e.target.price.value
        const brand = e.target.brand.value
        const tag = e.target.tag.value
        const color = e.target.color.value


        const imgRef = ref(imageDb, `files/${v4()}`)
        const urlImage = uploadBytes(imgRef, img)
        const snapshot = await urlImage;

        // Get the download URL from the snapshot
        const url = await getDownloadURL(snapshot.ref);

        const downloadURLs = [];
        try {
            for (const img of imgs) {
                const fileId = v4();
                const imgRef = ref(imageDb, `files/${fileId}`);
                await uploadBytes(imgRef, img);
                const downloadURL = await getDownloadURL(imgRef);
                downloadURLs.push(downloadURL);
                console.log('Download URL:', downloadURL);
            }
            // return downloadURLs; // Return the array of download URLs
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error; // Rethrow the error for the calling function to handle
        }


        try {
            await addDoc(collection(db, "products"), {
                name: name,
                price: price,
                brand: brand,
                tag: tag,
                photo: url,
                color: color,
                photos: downloadURLs
            });
            closeModal()
            setLoader(false)
            setPhoto("")
        } catch (e) {
            alert("Error adding document: ", e);
        }

    }

    /// single image upload
    const handleImg = (e) => {
        setImg(e)
        const url = URL.createObjectURL(e)
        setPhoto(url)
    }



    const handleImgs = async (e) => {
        setImgs(e)
    };



    return <>
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                preventScroll
            >
                <button onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>

                <div className="flex  min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            New Product Add
                        </h2>
                    </div>

                    <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={(e) => handleSubmit(e)} method="POST">
                            <div className='flex justify-between gap-2'>
                                <div >
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Name :
                                    </label>
                                    <div >
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"

                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                            Price :
                                        </label>

                                    </div>
                                    <div >
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"

                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-between gap-2'>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
                                            Color :
                                        </label>

                                    </div>
                                    <div >
                                        <input
                                            id="color"
                                            name="color"
                                            type="text"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">
                                            Brand :
                                        </label>

                                    </div>
                                    <div >
                                        <input
                                            id="brand"
                                            name="brand"
                                            type="text"

                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="tag" className="block text-sm font-medium leading-6 text-gray-900">
                                        Tag :
                                    </label>

                                </div>
                                <div >
                                    <input
                                        id="tag"
                                        name="tag"
                                        type="text"

                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="tag" className="block text-sm font-medium leading-6 text-gray-900">
                                        Photo :
                                    </label>

                                </div>
                                <div >
                                    <input type="file"
                                        onChange={(e) => handleImg(e.target.files[0])}
                                    />
                                    <div className='flex justify-center items-center'>
                                        {
                                            photo && <Image src={photo} alt="photo" width={80} height={80} />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="tag" className="block text-sm font-medium leading-6 text-gray-900">
                                        Default photo  minimum 4 photo upload:
                                    </label>

                                </div>
                                <div >
                                    <input type="file"
                                        onChange={(e) => handleImgs(e.target.files)}
                                        multiple
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {
                                        loader ? "Loading....." : "New Product Add"
                                    }
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>
        </div>
    </>;
};

export default ProductAdd;
