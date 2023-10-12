"use client"
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { firebaseApp } from "@/app/firebase";
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { imageDb } from '../utils/tools';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';


const UpdateProduct = ({ data, closeModal, modalIsOpen }) => {

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    /// photo manage state
    const [img, setImg] = useState("");
    const [photo, setPhoto] = useState("");


    const [input, setInput] = useState({
        name: "",
        price: Number,
        brand: "",
        tag: "",
        id: "",
        color: ""
    })

    const handleImageUrl = useCallback(async () => {
        const imgRef = ref(imageDb, `files/${v4()}`)
        const urlImage = uploadBytes(imgRef, img)
        const snapshot = await urlImage;

        // Get the download URL from the snapshot
        const url = await getDownloadURL(snapshot.ref);
        setInput((prev) => ({
            ...prev,
            photo: url
        }))
    }, [img])


    useEffect(() => {
        if (data) {
            setInput((prev) => ({
                ...prev,
                name: data[0].name,
                price: data[0].price,
                brand: data[0].brand,
                tag: data[0].tag,
                id: data[0].id,
                photo: data[0].photo,
                color: data[0].color,
            }))
            handleImageUrl()
        }

    }, [data, handleImageUrl])
    // state manage
    const handleOnChange = async (e) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const db = getFirestore(firebaseApp)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await updateDoc(doc(db, "products", input.id), input);
            closeModal()
        } catch (e) {
            alert("Error adding document: ", e);
        }

    }




    const handleImg = (e) => {
        setImg(e)
        const url = URL.createObjectURL(e)
        setPhoto(url)
    }




    return <>
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <button onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>

                <div className="flex  min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Update Product
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
                                            value={input.name}
                                            type="text"
                                            onChange={handleOnChange}
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
                                            value={input.price}
                                            type="number"
                                            onChange={handleOnChange}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between gap-2'>
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
                                            value={input.brand}
                                            type="text"
                                            onChange={handleOnChange}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">
                                            Color :
                                        </label>

                                    </div>
                                    <div >
                                        <input
                                            id="color"
                                            name="colorcolor"
                                            type="text"
                                            value={input.color}
                                            onChange={handleOnChange}
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
                                        value={input.tag}
                                        onChange={handleOnChange}
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
                                        <Image src={data?.[0]?.photo ? data[0].photo : input.photo} alt="photo" width={50} height={50} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>
        </div>
    </>;
};

export default UpdateProduct;
