import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DateFilter = () => {
    // state={
    //     fecha: new Date("2021","11","07")
    // }
    const newDate = new Date();
    // const [fecha, setFecha] = useState()
    // console.log(this.state.fecha);
        return(
        <DatePicker selected={newDate}/>
    )
}

export default DateFilter;