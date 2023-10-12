"use client"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { imageDb } from "../utils/tools";
import { v4 } from "uuid";
import Image from "next/image";

const Test = () => {

    const [img, setImg] = useState("")
    const [imgUrl, setImgUrl] = useState("")
    const [photo, setPhoto] = useState("")

    const handleClick = async () => {
        const imgRef = ref(imageDb, `files/${v4()}`)
        const urlImage = uploadBytes(imgRef, img)
        const snapshot = await urlImage;

        // Get the download URL from the snapshot
        const url = await getDownloadURL(snapshot.ref);
        console.log(url);


    }


    useEffect(() => {
        listAll(ref(imageDb, "files")).then(imgs => {
            imgs.items.forEach(val => {
                getDownloadURL(val).then(url => {
                    setImgUrl(data => [...data, url])
                })
            })

        })
    }, [])
    const handleImg = (e) => {
        setImg(e)
        const url = URL.createObjectURL(e)
        setPhoto(url)
    }


    return <div>


        <input type="file" onChange={(e) => handleImg(e.target.files[0])} />
        <Image src={photo} alt="photo" width={100} height={200} />
        <button onClick={handleClick}>Upload</button>
    </div>;
};

export default Test;
