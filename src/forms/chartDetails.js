import React from 'react'
import { useState, useEffect } from 'react'
import {
    Sparkline,
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartSeriesDefaults,
    ChartCategoryAxisItem,
    ChartTitle,
    ChartLegend,
    LegendItemClickEvent,
    ChartValueAxis,
  ChartValueAxisItem,
} from "@progress/kendo-react-charts";
import { unstable_composeClasses } from '@mui/material';
import Enumerable from 'linq';

const ChartDetails = ({ chartData }) => {
    // const [allData, setAllData] = useState([chartData]);
    // const [categoryAxis, setCategoryAxis] = useState([]);
    // const [payment, setPayment] = useState([]);
    // const [series1, setSeries1] = useState([]);
    // const [paymentSumation, setPaymentSummation] = useState([]);
    const [chartLdata,setChartLdata]=useState({});
    const [chartNewData,setChartdata]=useState({});
    useEffect(() => {
        const fetchData = async () => {
          //  console.log({ chartData })
            // let item = "";
            // let arr = [];
            // let arr1 = [];
            // let finalseries1arr = [];
            // let arrPaymentSum=[];
            // let arrPaymentSumFinal=[];
            // let arrseries1 = [];
            //var obj = new Object();

            // setLoading(true);
            try {

                {
                    // var data= JSON.parse(localStorage.getItem("gridData"));
                    // setChartLdata(data);
                   //  setChartdata(chartData);
                    //  var grouped = Enumerable.from(data).groupBy("$.buyerId", null, (key, g) => {
                    //     return { 
                    //        buyerId: key, 
                    //         payment: g.sum("$.payment | 0")
                    //    }
                    //   }).toArray();
                    //   let paymentSeriesArr=[];
                    //   for(let i=0;i<grouped.length;i++)
                    //   {

                    //     paymentSeriesArr.push(grouped[i].payment);
                    //   }
                    //   setPaymentSummation(paymentSeriesArr);
                    //   debugger;
                    // chartData.map(x => {
                    //     arr.push(x.buyer);
                    //     let objPaymentVsBuyer = new Object();
                    //     let paymentAmtArr = [];
                        
                    //     let chartdataFilter = chartData.filter(
                    //         (item) =>
                    //             item.buyerId == x.buyerId
                    //     );

                    //         debugger;
                    //     chartdataFilter.map(x => {
                    //         paymentAmtArr.push(x.payment);
                    //     })
                    //     let sum = 0;
                    //     for (let i = 0; i < paymentAmtArr.length; i++) {
                    //         debugger;
                    //         sum += paymentAmtArr[i];
                    //     }
                    //     arrPaymentSum.push(sum);
                    //     debugger;
                    //     objPaymentVsBuyer.paymentDate = x.paymentDate;
                    //     objPaymentVsBuyer.payments = paymentAmtArr;
                    //     objPaymentVsBuyer.buyerId = x.buyerId;
                    //     objPaymentVsBuyer.buyerName = x.buyer;


                    //     // objPaymentVsBuyer
                    //     // paymentAmtArr.push(x.payment);

                    //     // paymentAmtArr.push(objPayment)
                    //     debugger;
                    //     arrseries1.push(objPaymentVsBuyer);

                    // }

                    // )

                    // arr1 = arr.filter(
                    //     (item, index, aref) => aref.indexOf(item) === index
                    // );

                    // finalseries1arr = arrseries1.filter((value, index, self) =>
                    //     index === self.findIndex((t) => (
                    //         t.buyerId === value.buyerId
                    //     ))
                    // )
                    // finalseries1arr=arrseries1.filter(
                    //     (item, index, aref) => aref.indexOf(item) === index
                    // );
                  //  arrPaymentSumFinal

                    // setCategoryAxis(arr);
                    // setSeries1(finalseries1arr);
                   // setPaymentSummation(arrPaymentSum);
                 //     console.log(arrPaymentSum);
                  //  console.log(paymentSumation);
                    // debugger;
                    // countries = categoryAxis.filter(
                    //     (item, index, aref) => aref.indexOf(item) === index
                    //   );
                    //   console.log({categoryAxis})

                }


                //  getHomepageData(data.token,email);
                //  console.log(data);
            } catch (error) {
                console.error(error.message);
            }

        }
        fetchData();
    }, []);

    
    return (
        <div className='container' >
            <Chart>
                {/* <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={categoryAxis} />
                </ChartCategoryAxis> */}
                <ChartSeriesDefaults
                    type="column"
                    labels={{
                        visible: true,
                        format: "n2",
                    }}
                />

                {/* <ChartValueAxis>
                    <ChartValueAxisItem crosshair={crosshair} />
                </ChartValueAxis> */}
                <ChartSeries>

                    <ChartSeriesItem
                    data={chartData}
                    type='column'
                    field='payment'
                    categoryField='buyer'
                    aggregate='sum'
                    
                    />
              
                </ChartSeries> 

                 <ChartSeries>

                    <ChartSeriesItem
                    data={chartData}
                    type='column'
                    field='payment'
                    categoryField='buyer'
                    aggregate='sum'
                    
                    />
                    
                    <ChartSeriesItem
                    data={chartData}
                    type='column'
                    field='totalPrice'
                    categoryField='buyer'
                   // aggregate='sum'
                    
                    />
              
              
                </ChartSeries> 


            </Chart>



        </div>
    )
}

export default ChartDetails
