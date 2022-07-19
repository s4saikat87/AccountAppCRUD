import React from 'react'
import Header from './header';
import {
    useLocation, useNavigate
} from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridAutoSizer } from '@mui/x-data-grid';
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

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { auth } from '../utils/firebase/firebase.utils';
import Loading from './loading';
import process from 'process'

const Dashboard = () => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [openAddBuyer, setAddOpenBuyer] = React.useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [errorMessage, setErrorMessage] = useState([]);
    const [touched, setTouched] = useState(false);
    const [rowBuyerGet, setRowBuyerGet] = useState([]);
    const [id, setId] = useState(0);
    const [stateBuyer, setstateBuyer] = React.useState({
        buyerName: "",
        flatMeasurement: "",
        pricePersqft: "",
        totalPrice: ""

    });
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
                //  getHomepageData(data.token,email);
                //  console.log(data);
            } catch (error) {
                console.error(error.message);
            }

        }
        fetchData();
    }, [])




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
            pricePersqft: "",
            totalPrice: ""
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
     
      //  cellVal.row.id

      axios.delete(`/deleteBuyer/${cellVal.row.id}`,
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


          setstateBuyer({
              ...stateBuyer,
              buyerName: "",
              flatMeasurement: "",
              pricePersqft: "",
              totalPrice: ""
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

    const columnsBuyer = [

        { field: 'buyerName', headerName: 'Buyer Name', width: 200 },

        {
            field: 'flatMeasurement',
            headerName: 'Flat Measurement',
            disablePadding: true,
            type: 'number',
            width: 180,
            //valueFormatter: ({ value }) => `${value.toFixed(0)}`
        },
        {
            field: 'pricePersqft',
            headerName: 'Price Per sqft.',
            type: 'number',
            width: 150,
            // valueFormatter: ({ value }) => `${value.toFixed(2)}`
        },
        {
            field: 'totalPrice',
            headerName: 'Total Price',
            type: 'number',
            width: 150,
            // valueFormatter: ({ value }) => `${value.toFixed(2)}`
        },
        { field: 'createdBy', headerName: 'createdBy', width: 230 },
        { field: 'createrEmail', headerName: 'createrEmail', width: 230 },
        {
            field: "Edit",
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
            field: "Delete",
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



    const handleSubmitBuyer = () => {
       
        let isError = false;
        setTouched(true);

        if (stateBuyer.buyerName === '') {
            setErrorMessages({ name: "buyerName", message: "Buyer Name can't be blank." });
            //  isError = true;
            //  setErrorMessage(["Buyer Name can't be blank."])
            //  setTouched(true);
        }

        else if (stateBuyer.flatMeasurement === '') {
            setErrorMessages({ name: "flatMeasurement", message: "Flat Measurement can't be blank." });
            // isError = true;
            //  setErrorMessage(["Flat Measurement can't be blank."])
            // setTouched(true);
        }



        else if (stateBuyer.pricePersqft === '') {
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
                            pricePersqft: "",
                            totalPrice: ""
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
                            pricePersqft: "",
                            totalPrice: ""
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


    const handleChange = (event) => {

        setstateBuyer({
            ...stateBuyer,
            [event.target.name]: event.target.value
        });




        //  setTouched(true);

    };
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

                        </div>
                        <div className='col-3 d-flex justify-content-end'>
                            <a className="btn btn-outline-primary btn-sm" onClick={handleClickOpen}>Add Buyer</a>
                        </div>




                    </div>

                </div>
                <div className="row text-center">

                    {

                        <div style={{ height: 350, width: '100%' }}>
                            <DataGrid
                                getRowId={row => Math.random()}
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
                                        value={stateBuyer.pricePersqft * stateBuyer.flatMeasurement} variant="outlined" label='Total Price'

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


            {/*   compoff dialog end   */}









        </div>



    )
}

export default Dashboard
