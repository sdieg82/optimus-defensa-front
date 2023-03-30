import React, {useEffect} from 'react';
import Layout from '../components/Layout'
import {
    BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import { gql, useQuery } from '@apollo/client';

const BAJO_STOCK=gql`
query Query {
    bajoStock {
        id
        marca
        modelo
        nombreProveedor
        nombre
        precio
        existencia
    }
  }
`

const BajoStock = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(BAJO_STOCK);
    

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if(loading) return 'cargando...';

    console.log(data);


    const {bajoStock} = data;
    
    const productoGrafica = [
        
    ];

    bajoStock.map((producto, index) => {
        productoGrafica[index] = {
            ...producto
        }
    })
   
    

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Bajas Existencias</h1>

            <BarChart
                className="mt-10"
                width={600}
                height={500}
                data={productoGrafica}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre"/>
                <YAxis/>
                <Tooltip />
                <Legend  />
                <Bar dataKey="existencia" fill="#3182CE" />
           
            </BarChart>
        </Layout>
     );
}
 
export default BajoStock;