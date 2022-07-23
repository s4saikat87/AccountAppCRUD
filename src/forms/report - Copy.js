import React from 'react';
import Header from './header';
import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import Loading from './loading';
// import { Grid } from 'ag-grid-community';

// import 'ag-grid-community/styles//ag-grid.css';
// import 'ag-grid-community/styles//ag-theme-alpine.css';
import { Grid, GridColumn as Column ,GridToolbar } from "@progress/kendo-react-grid";
import { Sparkline } from "@progress/kendo-react-charts";
import { async } from '@firebase/util';
import "@progress/kendo-theme-material/dist/all.css";
import { ColumnMenu } from "./columnMenu";
import {
  ExcelExport,
  ExcelExportColumn,
} from "@progress/kendo-react-excel-export";
import { groupBy,orderBy ,process } from "@progress/kendo-data-query";


const initialGroup = [
  {
    field: "buyer",
  }
 
];
const initialSort = [
  {
    field: "buyer",
    dir: "asc",
  },
];


const aggregates = [
  {
    field: "buyer",
    aggregate: "sum",
  }
  
];
const Report = () => {
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(false);
  
  
  const [sort, setSort] = React.useState(initialSort);
  const [group, setGroup] = React.useState(initialGroup);
  const _export = React.useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        PaymentGetData();
        //  getHomepageData(data.token,email);
        //  console.log(data);
      } catch (error) {
        console.error(error.message);
      }

    }
    fetchData();
  }, []);
  const PaymentGetData = async () => {
    setLoading(true);
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

        setRow(reqPaymentData);

        setLoading(false);

      })
      .catch((error) => {

        return error;
      });

  }
  const excelExport = () => {
   
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  const TotalPaymentCell = (props) => {
    const total = row.reduce((acc, current) => acc + current[props.field], 0);
    return (
        <td colSpan={props.colSpan} style={props.style}>
            total: {total.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </td>
    );
}


  if (loading) {
    return <Loading />
  }
  return (
    <div>
      <Header />
      <div className="my-2">
        <div className="card-header pb-2 mb-2 w-100 mx-1">
          <div className='row'>
            <div className='col-12'>
              <div className='tableheader'>Report</div>
            </div>
          </div>
        </div>
        <ExcelExport data={row} ref={_export}>
        <Grid style={{ height: "510px" }}
        // data={row} 
        // data={orderBy(row, sort)}
       //  sortable={true}
       //  sort={sort}
        //  onSortChange={(e) => {
        //    setSort(e.sort);
        //  }}

         data={groupBy(row, group)}
        groupable={true}
        group={group}
         onGroupChange={(e) => {
           setGroup(e.group);
         }}
        
      
        >
          <GridToolbar>
          <button
            title="Export Excel"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={excelExport}
          >
            Export to Excel
          </button>
        </GridToolbar>
          <Column field="buyer" menu={true} title="Buyer Name" width="340px"   />
          <Column field="totalPrice" title="Total Price(Rs)" width="240px" filter="numeric"  />
          <Column field="payment" title="Payment Received(Rs)" width="240px" filter="numeric" 
          footerCell={TotalPaymentCell}
          />
          
          <Column field="paymentDate" title="Payment Date" width="300px" />

          {/* <Column
            field="PriceHistory"
            title="Price history"
            cell={SparkLineChartCell}
          /> */}
          {/* <Column
            field="Discontinued"
            width="130px"
            cell={props => (
              <td>
                <input
                  className="k-checkbox"
                  type="checkbox"
                  disabled
                  defaultChecked={props.dataItem[props.field]}
                />
                <label className="k-checkbox-label" />
              </td>
            )}
          /> */}
        </Grid>
</ExcelExport>
      </div>
    </div>
  )
}

export default Report
