"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { auth, firebaseApp } from "@/app/firebase";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import Topbar from "../components/Topbar";

import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot } from "firebase/firestore"
import ProductAdd from "../components/ProductAdd";
import swal from "sweetalert";
import UpdateProduct from "../components/UpdateProduct";
import Image from "next/image";


const Dashboard = () => {
    const columns = [
        {
            name: "Name",
            selector: "name",
            sortable: true,
        }, {
            name: "Image",
            selector: (row) => (
                <>
                    <Image src={row.photo} alt="photo" width={50} height={50} />
                </>
            ),
            sortable: true,
        },
        {
            name: "Price",
            selector: "price",
            sortable: true,
        },
        {
            name: "Brand",
            selector: "brand",
            sortable: true,
        }, {
            name: "Tag",
            selector: "tag",
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <>

                    <button
                        type="button"
                        className="bg-amber-400 text-medium p-2 rounded-md"
                        onClick={() => handleUpdate(row.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>


                    </button> <button
                        type="button"
                        className="bg-red-500 text-medium p-2 rounded-md"
                        onClick={() => deleteSingleProduct(row.id)}

                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>

                    </button>
                </>
            ),
        },
    ];

    //products data state
    const [data, setData] = useState([]); // Your data state

    // product update id state
    const [updateData, setUpdateData] = useState(null)

    // react-data-table manage state 
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);



    const route = useRouter();

    const [user, setUser] = useState(null);
    // firebase data store function 
    const db = getFirestore(firebaseApp)


    // // get product function
    // const getProducts = useCallback(async () => {
    //     const products = await getDocs(collection(db, "products"));
    //     const productsData = products.docs.map((doc) => {
    //         return {
    //             id: doc.id,
    //             ...doc.data(),
    //         };
    //     });
    //     setData(productsData);
    // }, [db]);


    // delete single product

    const deleteSingleProduct = useCallback(async (id) => {

        if (id) {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this imaginary file!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        try {
                            await deleteDoc(doc(db, "products", id))
                        } catch (error) {
                            alert("Error getting products: ", error);
                        }
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                        });
                    } else {
                        swal("Your imaginary file is safe!");
                    }
                });
        }
    }, [db]);


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

            setData(productsData)
            return productsData
        });
        return unsubscribe
    }, [db]);





    // modal function
    const [modalIsOpen, setIsOpen] = useState(false);


    function openModal() {
        setIsOpen(true);

    }

    function closeModal() {
        setIsOpen(false);

    }

    // product update modal function
    const [modalIsOpenu, setIsOpenu] = useState(false);


    function openModalu() {
        setIsOpenu(true);

    }

    function closeModalu() {
        setIsOpenu(false);

    }




    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                route.push("/dashboard");
                setUser(user)
            } else {
                route.push("/login");
                setUser(null);
            }
        });
        getDataRealTime()

        return () => unsubscribe();


    }, [route, getDataRealTime]);


    /// update product function
    const handleUpdate = (id) => {
        if (id) {
            const datap = data.filter((data) => data.id === id)
            setUpdateData(datap)

            openModalu()
        } else {
            setIsOpenu(false);
        }
    }



    // react-data-table
    // Selected Rows map
    const handleRowSelect = (state) => {
        setSelectedRows(state.selectedRows.map((row) => row));
    };

    // Delete all rows seleted Brands
    const contextActions = useMemo(() => {
        const handleDelete = () => {
            swal({
                title: "Danger",
                text: "Are you sure",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    try {
                        // Ensure selectedRows is an array
                        const rowsToDelete = Array.isArray(selectedRows) ? selectedRows : [selectedRows];
                        rowsToDelete.forEach(async (rowId) => {
                            await deleteDoc(doc(db, "products", rowId.id))
                            console.log(rowId.id);

                        });
                    } catch (error) {
                        alert("Error deleting products: " + error);
                    }
                    setToggleCleared(!toggleCleared);
                    setSelectedRows([]);
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your imaginary file is safe!");
                    setToggleCleared(!toggleCleared);
                    setSelectedRows([]);
                }
            });
        };


        return (
            <>
                <button
                    type="button"
                    className="bg-red-500 text-medium p-2 rounded-md"
                    onClick={handleDelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>

                </button>
            </>
        );
    }, [selectedRows, setToggleCleared, toggleCleared, db]);

    // Brand Data search and Filtering code
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredItems = data?.filter(
        (item) =>
            item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText("");
        }
    };





    return <>
        <div>
            <ProductAdd closeModal={closeModal} modalIsOpen={modalIsOpen} />

            <UpdateProduct data={updateData} closeModal={closeModalu} modalIsOpen={modalIsOpenu} />
            <Topbar />
            <div className="m-5">
                <button
                    onClick={openModal}
                    className="p-3 mx-auto bg-sky-400 rounded-md mb-2"
                >
                    Add new brand
                </button>
                <DataTable
                    fixedHeader
                    pagination
                    className="shadow-sm"
                    title="All Prodcuts Data"
                    columns={columns}
                    data={filteredItems}
                    onSelectedRowsChange={handleRowSelect}
                    contextActions={contextActions}
                    selectableRows
                    highlightOnHover
                    clearSelectedRows={toggleCleared}
                    subHeader
                    subHeaderAlign="right"
                    subHeaderComponent={
                        <>

                            <input
                                id="search"
                                type="text"
                                className="form-control"
                                placeholder="Search ..."
                                aria-label="Search Input"
                                style={{ width: "200px" }}
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            {
                                filterText.length > 0 && <button
                                    type="button"
                                    className="text-medium p-2 rounded-md"
                                    onClick={handleClear}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>


                                </button>
                            }


                        </>
                    }
                />
            </div>
        </div>
    </>;
};

export default Dashboard;
