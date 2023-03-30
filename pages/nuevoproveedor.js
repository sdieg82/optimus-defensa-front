import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const NUEVO_PROVEEDOR = gql`
    mutation nuevoProveedor($input: ProveedorInput) {
        nuevoProveedor(input: $input) {
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

const NuevoProveedor = () => {

    const router = useRouter();

    // Mensaje de alerta
    const [mensaje, guardarMensaje] = useState(null);


    // Mutation para crear nuevos clientes
    const [ nuevoProveedor ] = useMutation(NUEVO_PROVEEDOR, {
        update(cache, { data: { nuevoProveedor } } ) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerProveedores } = cache.readQuery({ query: OBTENER_PROVEEDORES  });

            // Reescribimos el cache ( el cache nunca se debe modificar )
            cache.writeQuery({
                query: OBTENER_PROVEEDORES,
                data: {
                    obtenerProveedores  : [...obtenerProveedores , nuevoProveedor ]
                }
            })
        }
    })


    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            cedula: '',
            direccion: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string() 
                        .matches(/^[aA-zZ-á-é-í-ó-ú-Á-É-Í-Ó-Ú\s]+$/, "Ingrese solo letras ")
                        .required('El nombre del proveedor es obligatorio'),
            apellido: Yup.string() 
                        .matches(/^[aA-zZ-á-é-í-ó-ú-Á-É-Í-Ó-Ú\s]+$/, "Ingrese solo letras ")
                        .required('El apellido del proveedor es obligatorio'),
            cedula: Yup.string()
                        .matches(/^[0-9]+$/, "Ingrese solo numeros ")
                        .required('La cédula del proveedor es obligatorio'),
            direccion: Yup.string() 
                        .required('El campo de la dirección  es obligatorio'),
            email: Yup.string()
                        .email('Email no válido') 
                        .required('El email del proveedor es obligatorio'),
            telefono: Yup.string()
                        .matches(/^[0-9]+$/, "Ingrese solo numeros ")
                        .required('El telefono del proveedor es obligatorio')

        }), 
        onSubmit: async valores => {

            const {nombre, apellido, cedula, direccion, email, telefono } = valores

            try {
                const { data } = await nuevoProveedor({
                    variables: {
                        input: {
                            nombre, 
                            apellido, 
                            cedula, 
                            direccion, 
                            email, 
                            telefono
                        }
                    }
                });
               
                // Mostrar una alerta
               
                // console.log(data.nuevoCliente);
                 // redireccionar hacia proveedores
                 Swal.fire(
                    'Creado',
                    'Se creó el cliente correctamente',
                    'success'
                )
                // console.log(data.nuevoCliente);
                router.push('/proveedores'); // redireccionar hacia clientes
            } catch (error) {
               
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

                
            }
        }
    })

    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Proveedor</h1>

            {mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombres Completos del Proveedor
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre del Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                            </div>

                            { formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellidos Completos del Proveedor
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Apellido del Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.apellido}
                                />
                            </div>

                            { formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                            ) : null  }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cedula">
                                    Cédula del Proveedor
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cedula"
                                    type="text"
                                    placeholder="Cédula del Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cedula}
                                />
                            </div>

                            { formik.touched.cedula && formik.errors.cedula ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cedula}</p>
                                </div>
                            ) : null  }


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                   Dirección
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="direccion"
                                    type="text"
                                    placeholder="Dirección del  Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.direccion}
                                />
                            </div>

                            { formik.touched.direccion && formik.errors.direccion ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.direccion}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>

                            { formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                    Teléfono
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="telefono"
                                    type="tel"
                                    placeholder="Teléfono Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.telefono}
                                />
                            </div>

                            { formik.touched.telefono && formik.errors.telefono ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.telefono}</p>
                                </div>
                            ) : null  }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Registrar Proveedor"
                            />
                    </form>
                </div>
            </div>
        </Layout>
        
     );
}
 
export default NuevoProveedor;