import React from 'react'
import Header from './header';
import {
    useLocation, useNavigate
} from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridAutoSizer, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { auth } from '../utils/firebase/firebase.utils';
import Loading from './loading';
import process from 'process';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={{
                fileName: 'Buyer Details',
                delimiter: ';',
                utf8WithBom: true,
            }} />
        </GridToolbarContainer>
    );
}

function CustomToolbarPayment() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={{
                fileName: 'Payment Details',
                delimiter: ';',
                utf8WithBom: true,
            }} />
        </GridToolbarContainer>
    );
}

const Dashboard = () => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [openAddBuyer, setAddOpenBuyer] = React.useState(false);
    const [openAddPayment, setAddOpenPayment] = React.useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [errorMessage, setErrorMessage] = useState([]);
    const [touched, setTouched] = useState(false);
    const [rowBuyerGet, setRowBuyerGet] = useState([]);
    const [rowPaymentGet, setRowPaymentGet] = useState([]);

    const [id, setId] = useState(0);
    const [idPayment, setIdPayment] = useState(0);
    const [stateBuyer, setstateBuyer] = React.useState({
        buyerName: "",
        flatMeasurement: 0,
        pricePersqft: 0,
        totalPrice: ""

    });

    const [statePayment, setstatePayment] = React.useState({
        // buyerId:0,
        selBuyer: "",
        paymentReceived: 0,
        dateOfPayment: "",
        paymentPending: 0

    });

    const [buyerId, setBuyerId] = React.useState('');

    const [openError, setOpenError] = React.useState(false);
    const [errorCustom, setErrorCustom] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true);
            try {

                let data = location.state;
                let email = data.Email;
                let name = data.Name;
                setName(name);
                setEmail(email);
                BuyerGetData();
                PaymentGetData();
                //  getHomepageData(data.token,email);
                //  console.log(data);
            } catch (error) {
                console.error(error.message);
            }

        }
        fetchData();
    }, [])

    const handleClosePayment = (event, reason) => {
        if (reason && reason == "backdropClick")
            return;
        setAddOpenPayment(false);

        setstatePayment({
            ...statePayment,
            selBuyer: "",
            paymentReceived: 0,
            dateOfPayment: ""

        });
        setErrorMessages([]);

    }

    const handleCloseError = () => {

        setOpenError(false);
    }

    const handleCloseErrorOK = () => {
        debugger;
        if (id > 0) {

            axios.delete(`/deleteBuyer/${id}`,
                // postData,
                //   {
                //     headers: {
                //       'authorization': JSON.parse(localStorage.getItem('token')),
                //       'Accept': 'application/json',
                //       'Content-Type': 'application/json'
                //     }
                //   }
            )
                .then(response => {

                    console.log(response);
                    setLoading(false);
                    // const data = JSON.parse(response.data);
                    setId(0);

                    setstateBuyer({
                        ...stateBuyer,
                        buyerName: "",
                        flatMeasurement: "",
                        pricePersqft: 0,
                        totalPrice: 0
                    });
                    setErrorMessages([]);

                    if (response.status != undefined && response.status === "Failed") {
                        alert(response.msg);

                        setLoading(false);
                        //   setErrorCustom(data[0].Error);
                        //  setOpenError(true);

                    }
                    else {
                        setLoading(false);
                        BuyerGetData();

                        // setAddOpenBuyer(false);

                    }

                })
                .catch((error) => {

                    return error;
                });

        }

        else if (idPayment > 0) {
            debugger;
            let id = idPayment;
            axios.delete(`/paymentDelete/${id}`,
                // postData,
                //   {
                //     headers: {
                //       'authorization': JSON.parse(localStorage.getItem('token')),
                //       'Accept': 'application/json',
                //       'Content-Type': 'application/json'
                //     }
                //   }
            )
                .then(response => {
                    debugger;
                    console.log(response);
                    setLoading(false);
                    // const data = JSON.parse(response.data);
                    setIdPayment(0);

                    // setstateBuyer({
                    //     ...stateBuyer,
                    //     buyerName: "",
                    //     flatMeasurement: "",
                    //     pricePersqft: 0,
                    //     totalPrice: 0
                    // });
                    // setErrorMessages([]);

                    if (response.status != undefined && response.status === "Failed") {
                        alert(response.msg);

                        setLoading(false);
                        //   setErrorCustom(data[0].Error);
                        //  setOpenError(true);

                    }
                    else {
                        setLoading(false);
                        PaymentGetData();

                        // setAddOpenBuyer(false);

                    }

                })
                .catch((error) => {
                    debugger;
                    return error;
                });

        }


        setOpenError(false);
    }



    const handleClickOpenPayment = () => {
        setstatePayment({
            ...statePayment,
            selBuyer: "",
            paymentReceived: 0,
            dateOfPayment: ""

        });
        setAddOpenPayment(true);

    }

    const handleClickOpen = () => {
        setAddOpenBuyer(true);

    }
    const handleCloseBuyer = (event, reason) => {
        if (reason && reason == "backdropClick")
            return;
        setAddOpenBuyer(false);


        setstateBuyer({
            ...stateBuyer,
            buyerName: "",
            flatMeasurement: "",
            pricePersqft: 0,
            totalPrice: 0
        });
        setErrorMessages([]);
    }

    const handleEditClick = (e, cellVal) => {

        setstateBuyer({
            ...stateBuyer,
            buyerName: cellVal.row.buyerName,
            flatMeasurement: cellVal.row.flatMeasurement,
            pricePersqft: cellVal.row.pricePersqft,
            totalPrice: cellVal.row.totalPrice
        });
        setErrorMessages([]);
        setAddOpenBuyer(true);
        setId(cellVal.row.id);

    }

    const handleDeleteClick = (e, cellVal) => {

        setOpenError(true);
        setErrorCustom("Are you sure you want to delete buyer '" + cellVal.row.buyerName + "' ?");
        setId(cellVal.row.id);

    }
    const handleDeleteClickPayment = (e, cellVal) => {
        debugger;
        setOpenError(true);
        setErrorCustom("Are you sure you want to delete payment " + cellVal.row.payment + " of buyer '" + cellVal.row.buyer + "' ?");
        setIdPayment(cellVal.row.id);

    }

    const columnsBuyer = [

        {
            field: 'buyerName', headerName: 'Buyer Name',
            minWidth: 200, flex: 1,
            // width: 200
        },

        {
            field: 'flatMeasurement',
            headerName: 'Flat Measurement(Sqft.)',
            disablePadding: true,
            type: 'number',
            minWidth: 170, flex: 1,
            //width: 170,
            valueFormatter: ({ value }) => `${value.toLocaleString()}`
        },
        {
            field: 'pricePersqft',
            headerName: 'Price Per sqft.(Rs)',
            type: 'number',
            minWidth: 180, flex: 1,
            // width: 180,
            valueFormatter: ({ value }) => `${value.toLocaleString()}`
        },
        {
            field: 'totalPrice',
            headerName: 'Total Price',
            type: 'number',
            minWidth: 180, flex: 1,
            //width: 180,
            valueFormatter: ({ value }) => `${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
        },
        { field: 'createdBy', headerName: 'Created By', width: 170 },
        //  { field: 'createrEmail', headerName: 'createrEmail', width: 170 },
        {
            field: "Edit", minWidth: 100, flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={(event) => {
                            handleEditClick(event, cellValues);
                        }}
                    >
                        Edit
                    </Button>
                );
            }
        },
        {
            field: "Delete", minWidth: 100, flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={(event) => {
                            handleDeleteClick(event, cellValues);
                        }}
                    >
                        Delete
                    </Button>
                );
            }
        }

    ];

    const DateFormatter = (params) => {

        let date = new Date(params.value);
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return month + '/' + day + '/' + year;


    };

    const columnsPayment = [

        {
            field: 'buyer', headerName: 'Buyer Name',
            minWidth: 330, flex: 1 //width: 250 
        },

        {
            field: 'payment',
            headerName: 'Payment Received(Rs)',
            disablePadding: true,
            type: 'number',
            minWidth: 330, flex: 1,
            //  width: 200,
            valueFormatter: ({ value }) => `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        },
        {
            field: 'paymentDate',
            headerName: 'Payment Date',
            type: 'date',
            minWidth: 330, flex: 1,
            // width: 230,
            valueFormatter: DateFormatter
            //valueFormatter: ({ value }) => `${value.toLocaleString()}`
        },

        //{ field: 'createdBy', headerName: 'Created By', width: 250 },
        // { field: 'createrEmail', headerName: 'Creater Email', width: 230 },
        // {
        //     field: "Edit",
        //     renderCell: (cellValues) => {
        //         return (
        //             <Button
        //                 variant="contained"
        //                 color="secondary"
        //                 onClick={(event) => {
        //                     //handleEditClick(event, cellValues);
        //                 }}
        //             >
        //                 Edit
        //             </Button>
        //         );
        //     }
        // },
        {
            field: "Delete", minWidth: 330, flex: 1,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={(event) => {
                            handleDeleteClickPayment(event, cellValues);
                        }}
                    >
                        Delete
                    </Button>
                );
            }
        }

    ];



    //setOpenCompOff

    const BuyerGetData = async () => {
        setLoading(true);

        // let ApproverId = JSON.parse(localStorage.getItem('ApproverId'));
        // let AdministratorId = JSON.parse(localStorage.getItem('AdministratorId'));
        // let EmployeeId = JSON.parse(localStorage.getItem('empId'));

        //  const postData = { AdministratorId, ApproverId, EmployeeId };

        await axios.get('/getBuyersDetails',
            // postData,
            //   {
            //     headers: {
            //       'authorization': JSON.parse(localStorage.getItem('token')),
            //       'Accept': 'application/json',
            //       'Content-Type': 'application/json'
            //     }
            //   }
        )
            .then(response => {

                //  console.log(response);

                const reqBuyerData = response.data.data;

                setRowBuyerGet(reqBuyerData);

                setLoading(false);

            })
            .catch((error) => {

                return error;
            });

    }


    const PaymentGetData = async () => {
        setLoading(true);

        // let ApproverId = JSON.parse(localStorage.getItem('ApproverId'));
        // let AdministratorId = JSON.parse(localStorage.getItem('AdministratorId'));
        // let EmployeeId = JSON.parse(localStorage.getItem('empId'));

        //  const postData = { AdministratorId, ApproverId, EmployeeId };

        await axios.get('/getPaymentDetails',
            // postData,
            //   {
            //     headers: {
            //       'authorization': JSON.parse(localStorage.getItem('token')),
            //       'Accept': 'application/json',
            //       'Content-Type': 'application/json'
            //     }
            //   }
        )
            .then(response => {

                //  console.log(response);

                const reqPaymentData = response.data.data;
                debugger;
                setRowPaymentGet(reqPaymentData);

                setLoading(false);

            })
            .catch((error) => {

                return error;
            });

    }



    const handleSubmitBuyer = () => {

        let isError = false;
        setTouched(true);

        if (stateBuyer.buyerName === '') {
            setErrorMessages({ name: "buyerName", message: "Buyer Name can't be blank." });
            //  isError = true;
            //  setErrorMessage(["Buyer Name can't be blank."])
            //  setTouched(true);
        }

        else if (stateBuyer.flatMeasurement === 0 || stateBuyer.flatMeasurement === '') {
            setErrorMessages({ name: "flatMeasurement", message: "Flat Measurement can't be blank." });
            // isError = true;
            //  setErrorMessage(["Flat Measurement can't be blank."])
            // setTouched(true);
        }



        else if (stateBuyer.pricePersqft === 0 || stateBuyer.pricePersqft === '') {
            setErrorMessages({ name: "pricePersqft", message: "Price per sqft can't be blank." });
            //  isError = true;
            //  setErrorMessage(["Price Per sqft can't be blank."])
            //  setTouched(true);
        }
        //   else if (stateCompoff.txtDescCompOff === '') {
        //    // setErrorMessages({ name: "txtDescCompOff", message: '' });
        //     setErrorMessage(["Description can't be blank."])
        //   }



        else {
            setTouched(false);
            let buyerName = stateBuyer.buyerName;
            let flatMeasurement = stateBuyer.flatMeasurement;
            let pricePersqft = stateBuyer.pricePersqft;
            let totalPrice = stateBuyer.flatMeasurement * stateBuyer.pricePersqft;
            let loggedinUserName = name;
            let loggedinuserEmail = email;

            var postData = { buyerName, flatMeasurement, pricePersqft, totalPrice, loggedinUserName, loggedinuserEmail };
            setLoading(true);

            if (id === 0) {
                axios.post('/buyerSet',
                    postData,
                    //   {
                    //     headers: {
                    //       'authorization': JSON.parse(localStorage.getItem('token')),
                    //       'Accept': 'application/json',
                    //       'Content-Type': 'application/json'
                    //     }
                    //   }
                )
                    .then(response => {

                        console.log(response);
                        setLoading(false);
                        // const data = JSON.parse(response.data);


                        setstateBuyer({
                            ...stateBuyer,
                            buyerName: "",
                            flatMeasurement: "",
                            pricePersqft: 0,
                            totalPrice: 0
                        });
                        setErrorMessages([]);

                        if (response.status != undefined && response.status === "Failed") {
                            alert(response.msg);

                            setLoading(false);
                            //   setErrorCustom(data[0].Error);
                            //  setOpenError(true);

                        }
                        else {
                            setLoading(false);
                            BuyerGetData();
                            setAddOpenBuyer(false);
                        }

                    })
                    .catch((error) => {

                        return error;
                    });
            }

            else {

                axios.put(`/updateBuyerInfo/${id}`,
                    postData,
                    //   {
                    //     headers: {
                    //       'authorization': JSON.parse(localStorage.getItem('token')),
                    //       'Accept': 'application/json',
                    //       'Content-Type': 'application/json'
                    //     }
                    //   }
                )
                    .then(response => {

                        console.log(response);
                        setLoading(false);
                        // const data = JSON.parse(response.data);

                        setId(0);
                        setstateBuyer({
                            ...stateBuyer,
                            buyerName: "",
                            flatMeasurement: "",
                            pricePersqft: 0,
                            totalPrice: 0
                        });
                        setErrorMessages([]);

                        if (response.status != undefined && response.status === "Failed") {
                            alert(response.msg);

                            setLoading(false);
                            //   setErrorCustom(data[0].Error);
                            //  setOpenError(true);

                        }
                        else {
                            setLoading(false);
                            BuyerGetData();
                            setAddOpenBuyer(false);
                        }

                    })
                    .catch((error) => {
                        // setLoading(false);
                        return error;
                    });



            }

        }


    }

    const handleChangePayment = (event) => {
        debugger;
        //var index = event.nativeEvent.target.selectedIndex;
        // setBuyerId(index);
        // event.nativeEvent.target[index].text
        // if (event.target.name == 'paymentReceived' && event.target.value!="") {
        //     setstatePayment({ ...statePayment, 
        //         [event.target.name]: parseInt(event.target.value, 10) });

        // }
        // else {
        setstatePayment({
            ...statePayment,
            [event.target.name]: event.target.value
        });
        // }


    }

    // const handleClosePayment = (event, reason) => {
    //     if (reason && reason == "backdropClick")
    //         return;
    //     setAddOpenBuyer(false);


    //     setstateBuyer({
    //         ...stateBuyer,
    //         buyerName: "",
    //         flatMeasurement: "",
    //         pricePersqft: 0,
    //         totalPrice: 0
    //     });
    //     setErrorMessages([]);
    // }

    const handleChange = (event) => {
        debugger;
        setstateBuyer({
            ...stateBuyer,
            [event.target.name]: event.target.value
        });

    };

    const handleSubmitPayment = () => {

        setTouched(true);

        if (statePayment.selBuyer === '') {
            setErrorMessages({ name: "selBuyer", message: "Select a buyer." });

        }
        else if (statePayment.paymentReceived === 0 || statePayment.paymentReceived === '') {
            setErrorMessages({ name: "paymentReceived", message: "Payment can't be blank." });

        }
        else if (statePayment.dateOfPayment === "") {
            setErrorMessages({ name: "dateOfPayment", message: "Date of payment can't be blank." });

        }

        else {

            setTouched(false);
            debugger;

            const buyerData = rowBuyerGet.find((buyer) => buyer.id === statePayment.selBuyer);
            let buyer = buyerData.buyerName;
            let buyerId = statePayment.selBuyer;
            let payment = parseInt(statePayment.paymentReceived);
            let paymentDate = statePayment.dateOfPayment;
            let loggedinUserName = name;
            let loggedinuserEmail = email;

            var postData = { buyerId, buyer, payment, paymentDate, loggedinUserName, loggedinuserEmail };
            setLoading(true);

            //  if (id === 0) {
            axios.post('/paymentSet',
                postData,
                //   {
                //     headers: {
                //       'authorization': JSON.parse(localStorage.getItem('token')),
                //       'Accept': 'application/json',
                //       'Content-Type': 'application/json'
                //     }
                //   }
            )
                .then(response => {
                    debugger;
                    console.log(response);
                    setLoading(false);
                    // const data = JSON.parse(response.data);


                    setstatePayment({
                        ...statePayment,
                        // buyerId:0,
                        buyer: "",
                        paymentReceived: 0,
                        dateOfPayment: ""
                    });
                    setErrorMessages([]);

                    if (response.status != undefined && response.status === "Failed") {
                        alert(response.msg);

                        //setLoading(false);
                        //   setErrorCustom(data[0].Error);
                        //  setOpenError(true);

                    }
                    else {
                        //  setLoading(false);
                        // BuyerGetData();
                        PaymentGetData();
                        setAddOpenPayment(false);
                    }

                })
                .catch((error) => {

                    return error;
                });
            // }



        }

    }
    const Title = ({ children }) => <div className="title">{children}</div>;
    let closeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px' };
    // const renderErrorMessage = (name) =>
    //     name === errorMessages.name && (
    //         <div className="error">{errorMessages.message}</div>
    //     );
    const styleLogin = {
        float: 'right'

    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );


    if (loading) {
        return <Loading />
    }
    return (
        <div>
            <Header />
            {/* <h3>{name}</h3> 
          <h3>{email}</h3>  */}
            <div className='text-center mx-2 my-2 pt-2 bg-fitek text-white sticky-top'>
                <div className='row'>
                    <div className='col-sm-11 col-md-4 col-lg-4'>
                        <Typography sx={{ mb: 1.5 }}>
                            Name : {name}
                        </Typography>
                    </div>
                    <div className='col-sm-11 col-md-4 col-lg-4'>
                        <Typography sx={{ mb: 1.5 }}>
                            Email : {email}
                        </Typography>
                    </div>

                </div>
            </div>



            <div className="my-2">
                <div className="card-header pb-2 mb-2 w-100 mx-1">
                    <div className='row'>
                        <div className='col-6'>
                            <div className='tableheader'>Buyer Details</div>



                        </div>
                        <div className='col-3 d-flex justify-content-end'>
                            {/* <a className="btn btn-outline-primary btn-sm" onClick={handleClickOpen}>Add Buyer</a> */}
                        </div>
                        <div className='col-3 d-flex justify-content-end'>
                            <a className="btn btn-outline-primary btn-sm" onClick={handleClickOpen}>Add Buyer</a>
                        </div>





                    </div>

                </div>
                <div className="row text-center">

                    {

                        <div style={{ height: 300, width: '100%' }}>
                            <DataGrid
                                components={{
                                    Toolbar: CustomToolbar,
                                }}
                                getRowId={row => Math.random()}
                                disableSelectionOnClick
                                //  id={Math.random()}
                                rows={rowBuyerGet}
                                columns={columnsBuyer}
                                pageSize={5}
                                rowsPerPageOptions={[4]}

                            />
                        </div>

                    }
                </div>

            </div>

            <div className="my-2">
                <div className="card-header pb-2 mb-2 w-100 mx-1">
                    <div className='row'>
                        <div className='col-6'>
                            <div className='tableheader'>Payment Details</div>



                        </div>

                        <div className='col-3 d-flex justify-content-end'>
                            {/* <a className="btn btn-outline-primary btn-sm" onClick={handleClickOpen}>Add Buyer</a> */}
                        </div>
                        <div className='col-3 d-flex justify-content-end'>
                            <a className="btn btn-outline-primary btn-sm" onClick={handleClickOpenPayment}>Add Payment</a>
                        </div>




                    </div>

                </div>
                <div className="row text-center">

                    {

                        <div style={{ height: 320, width: '100%' }}>
                            <DataGrid
                                components={{
                                    Toolbar: CustomToolbarPayment,

                                }}
                               
                                disableSelectionOnClick
                                // componentsProps={{ Toolbar: { csvOptions: { fields: ['buyer','payment', 'paymentDate'] } } }}
                                // rowGroupingColumnMode="single"

                                getRowId={row => Math.random()}
                                //  id={Math.random()}
                                rows={rowPaymentGet}
                                columns={columnsPayment}
                                pageSize={3}
                                rowsPerPageOptions={[4]}

                            />
                        </div>

                    }
                </div>

            </div>
            {/*  Add buyer dialog start */}


            <Dialog

                fullWidth={true}
                maxWidth={'sm'}
                open={openAddBuyer}
                onClose={handleCloseBuyer}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogTitle id="alert-dialog-title" className='lead ms-2 mt-1'>
                    <Title>{"Add Buyer"} <img src={require('../Images/Close.png')} onClick={handleCloseBuyer} style={closeImg} /></Title>

                </DialogTitle>
                <DialogContent>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Box sx={{
                            height: "100%",
                            width: "100%",
                            '&:hover': {
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                        >


                            <div className='row'>

                                <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Buyer Name:</label>

                                    <TextField
                                        className='form-control' name='buyerName'
                                        value={stateBuyer.buyerName} onChange={handleChange} variant="outlined" label='Name'

                                    ></TextField>
                                    {renderErrorMessage("buyerName")}

                                </div>
                                <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Price Per Sqft:</label>

                                    <TextField type="number"
                                        className='form-control' name='pricePersqft'
                                        value={stateBuyer.pricePersqft} onChange={handleChange} variant="outlined" label='price'

                                    // error={touched && Boolean(errorMessage.length)}
                                    // {...(errorMessage[stateBuyer.pricePersqft] && { error: true, helperText: errorMessage[stateBuyer.pricePersqft] })}
                                    // helperText={touched && errorMessage[0]}
                                    ></TextField>
                                    {renderErrorMessage("pricePersqft")}
                                </div>
                            </div>


                            <div className='row'>

                                <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Flat Measurement:</label>
                                    <TextField type="number"
                                        className='form-control' name='flatMeasurement'
                                        value={stateBuyer.flatMeasurement} onChange={handleChange} variant="outlined" label='Total Area'

                                    // error={touched && Boolean(errorMessage.length)}
                                    //  helperText={touched && errorMessage[0]}
                                    ></TextField>
                                    {renderErrorMessage("flatMeasurement")}



                                </div>

                                <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Total Price:</label>
                                    <TextField type='number'
                                        className='form-control' name='totalPrice'
                                        value={(stateBuyer.pricePersqft * stateBuyer.flatMeasurement).toFixed(2)} variant="outlined" label='Total Price'

                                    // error={touched && Boolean(errorMessage.length)}
                                    // helperText={touched && errorMessage[0]}
                                    ></TextField>

                                </div>
                            </div>


                            <DialogActions>
                                <Button onClick={handleCloseBuyer}>Close</Button>
                                <Button onClick={handleSubmitBuyer} autoFocus>
                                    Save
                                </Button>
                            </DialogActions>
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>


            {/*   Add buyer dialog end   */}

            {/*   Error dialog Start   */}
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={openError}
                onClose={handleCloseError}>
                <DialogTitle id="alert-dialog-title">

                    <Title>{"Confirmation"} <img src={require('../Images/Close.png')} onClick={handleCloseError} style={closeImg} /></Title>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <label >{errorCustom}</label>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseErrorOK}>Ok</Button>
                    <Button onClick={handleCloseError}>Cancel</Button>

                </DialogActions>


            </Dialog>


            {/*  Add buyer dialog start */}


            <Dialog

                fullWidth={true}
                maxWidth={'sm'}
                open={openAddPayment}
                onClose={handleClosePayment}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogTitle id="alert-dialog-title" className='lead ms-2 mt-1'>
                    <Title>{"Add Payment"} <img src={require('../Images/Close.png')} onClick={handleClosePayment} style={closeImg} /></Title>

                </DialogTitle>
                <DialogContent>
                    <div style={{ height: "100%", width: "100%" }}>
                        <Box sx={{
                            height: "100%",
                            width: "100%",
                            '&:hover': {
                                opacity: [0.9, 0.8, 0.7],
                            },
                        }}
                        >


                            <div className='row'>

                                <div className='col-sm-10 col-md-6 my-1'>
                                    <InputLabel id="selectLabel">Buyer Name</InputLabel>
                                    <Select name="selBuyer" value={statePayment.selBuyer} displayEmpty onChange={handleChangePayment} label="Buyer Name" style={{ minWidth: 220 }} labelId="selectLabel" >
                                        <MenuItem value="">
                                            <em>--Select Buyer--</em>
                                        </MenuItem>
                                        {rowBuyerGet.map((options) => (
                                            <MenuItem key={options.id} value={options.id}>
                                                {options.buyerName}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {renderErrorMessage("selBuyer")}

                                    {/* <TextField
                                        className='form-control' name='buyerName'
                                        value={stateBuyer.buyerName} onChange={handleChange} variant="outlined" label='Name'

                                    ></TextField> 
                                    {renderErrorMessage("buyerName")}*/}

                                </div>
                                <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Payment Received:</label>

                                    <TextField type="number"
                                        className='form-control' name='paymentReceived'
                                        value={statePayment.paymentReceived} onChange={handleChangePayment} variant="outlined"

                                    // error={touched && Boolean(errorMessage.length)}
                                    // {...(errorMessage[stateBuyer.pricePersqft] && { error: true, helperText: errorMessage[stateBuyer.pricePersqft] })}
                                    // helperText={touched && errorMessage[0]}
                                    ></TextField>
                                    {renderErrorMessage("paymentReceived")}
                                </div>
                            </div>


                            <div className='row'>

                                <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Payment Date:</label>
                                    <TextField type="date"
                                        className='form-control' name='dateOfPayment'
                                        value={statePayment.dateOfPayment} onChange={handleChangePayment} variant="outlined"

                                    // error={touched && Boolean(errorMessage.length)}
                                    //  helperText={touched && errorMessage[0]}
                                    ></TextField>
                                    {renderErrorMessage("dateOfPayment")}



                                </div>

                                {/* <div className='col-sm-10 col-md-6 my-1'>
                                    <label >Pending Amount:</label>
                                    <TextField type='number'
                                        className='form-control' name='paymentPending'
                                      //  value={statePayment.paymentPending * stateBuyer.flatMeasurement} 
                                        variant="outlined" label=''

                                    // error={touched && Boolean(errorMessage.length)}
                                    // helperText={touched && errorMessage[0]}
                                    ></TextField>

                                </div> */}
                            </div>


                            <DialogActions>
                                <Button onClick={handleClosePayment}>Close</Button>
                                <Button onClick={handleSubmitPayment} autoFocus>
                                    Save
                                </Button>
                            </DialogActions>
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>



        </div>



    )
}

export default Dashboard
