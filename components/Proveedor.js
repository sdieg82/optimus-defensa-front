import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_PROVEEDOR = gql`
    mutation eliminarProveedor($id: ID!) {
        eliminarProveedor(id:$id) 
    }
`;



const OBTENER_PROVEEDORES = gql`
    query obtenerProveedores {
        obtenerProveedores {
            id
            nombre
            apellido
            cedula
            direccion
            email
            telefono
          }
    }

`;



const Proveedor = ({proveedor}) => {

    // mutation para eliminar proveedor
    const [ eliminarProveedor ] = useMutation( ELIMINAR_PROVEEDOR, {
        update(cache) {
            // obtener una copia del objeto de cache
            const { obtenerProveedores } = cache.readQuery({ query: OBTENER_PROVEEDORES });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_PROVEEDORES,
                data: {
                    obtenerProveedores : obtenerProveedores.filter( proveedorActual => proveedorActual.id !== id )
                }
            })
        }
    }  );

    const { nombre, apellido ,cedula, direccion, email, id,telefono } = proveedor;


    // Elimina un proveedor
    const confirmarEliminarProveedor = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este proveedor?',
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
                    // Eliminar por ID
                    const { data } = await eliminarProveedor({
                        variables: {
                            id
                        }
                    });
                    // console.log(data);

                    // Mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProveedor,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }
    const editarProveedor = ()=> {
        Router.push({
            pathname: "/editarproveedor/[id]",
            query: {id} 
        })
    }


    return ( 
            <tr>
                <td className="border px-4 py-2">{nombre}  {apellido}</td>
                <td className="border px-4 py-2">{direccion}</td>
                <td className="border px-4 py-2">{cedula}</td>
                <td className="border px-4 py-2">{email}</td>
                <td className="border px-4 py-2">{telefono}</td>
              
                
                <td className="border px-4 py-2">
                    <button
                        type="button"
                        className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={() => editarProveedor() }
                    >
                        Editar

                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                </td>
            </tr>
     );
}
 
export default Proveedor;