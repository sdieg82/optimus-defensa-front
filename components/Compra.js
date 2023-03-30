import React from 'react';
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router';


const ELIMINAR_PRODUCTO = gql`
    mutation eliminarProducto($id: ID!) {
        eliminarProducto(id: $id) 
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
      obtenerProductos {
          id
          marca
          modelo
          nombreProveedor
          nombre
          precio
          existencia
          cantidadCompra
          precioCompra
          
      }
  }
`;

const Compra = ({producto}) => {
    const { codigo, nombre, precio, marca,modelo,nombreProveedor, existencia, id,cantidadCompra,precioCompra } = producto;

    // Mutation para eliminar productos
    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter( productoActual => productoActual.id !== id )
                }
            })
        }
    });


    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
          }).then( async (result) => {
                if (result.value) {
                        try {
                            // eliminar producto de la bd
                            const { data } = await eliminarProducto({
                                variables: {
                                    id
                                }
                            });

                            // console.log(data);

                            Swal.fire(
                                'Correcto',
                                data.eliminarProducto,
                                'success'
                            )
                        } catch (error) {
                            console.log(error);
                        }
                
                }
          })
    }


    const editarProducto = () => {
        console.log('click')
        Router.push({
            pathname: "/editarproducto/[id]",
            query: { id }
        })
    }

    const comprarProducto = () => {
        console.log('click')
        Router.push({
            pathname: "/comprarproducto/[id]",
            query: { id }
        })
    }

    return ( 
        <tr>
            <td>
        <div className={` border-green-500 border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-3 md:gap-4 shadow-lg`}>
        <div>
            <p className="font-bold text-gray-800">
                
                Proveedor : </p>


            {nombreProveedor && (
                <p className="flex items-center my-2">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>{nombreProveedor}
                </p>
            )}

            {/* {email && (
                <p className="flex items-center my-2">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {email}
                </p>
            )}

            {telefono && (
                <p className="flex items-center my-2">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    {telefono}
                </p>
            )} */}

            <h2 className="text-gray-800 font-bold mt-10">Estado Compra:</h2>

            <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold "
            >
                    <option value="COMPLETADO">COMPLETADO</option>
                   
            </select>
        </div>

        <div>
            <h2 className="text-gray-800 font-bold mt-3">Resumen antes de la compra</h2>
            {/* { pedido.pedido.map( articulo => ( */}
                <div key={producto.id} className="mt-4">
                     
                    <p className="text-sm text-gray-600">Producto: {producto.nombre} </p>
                    <p className="text-sm text-gray-600">Marca: {producto.marca} </p>
                    <p className="text-sm text-gray-600">Modelo: {producto.modelo} </p>
                    <p className="text-sm text-gray-600">Cantidad: {producto.cantidadCompra} </p>
                    <p className="text-sm text-gray-600">Precio: {producto.precioCompra} </p>
                </div>
             
             {/* } */}

            {/* <p className="text-gray-800 mt-3 font-bold ">Total a pagar:
                <span className="font-light"> $ {total}</span>
            </p> */}

            {/* <button
                className="uppercase text-xs font-bold  flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                onClick={ () => confirmarEliminarPedido() }
            >
                Eliminar Pedido

                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

            </button> */}
        </div>

        <div>
            <h2 className="text-gray-800 font-bold mt-3">Resumen después de la compra</h2>
            {/* { pedido.pedido.map( articulo => ( */}
                <div key={producto.id} className="mt-4">
                    <p className="text-sm text-gray-600">Cantidad Total: {producto.existencia} </p>
                    <p className="text-sm text-gray-600">Precio por unidad : {producto.precio} </p>
                </div>
             
             {/* } */}

            {/* <p className="text-gray-800 mt-3 font-bold ">Total a pagar:
                <span className="font-light"> $ {total}</span>
            </p> */}

            {/* <button
                className="uppercase text-xs font-bold  flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                onClick={ () => confirmarEliminarPedido() }
            >
                Eliminar Pedido

                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

            </button> */}
        </div>

        

         
    </div>
      
        

       
   </td>
    </tr>
     );
}
 
export default Compra;