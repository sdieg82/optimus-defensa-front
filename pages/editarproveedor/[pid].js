import { useQuery, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';

const OBTENER_PROVEEDOR = gql`
    query obtenerProveedor($id: ID!) {
        obtenerProveedor(id: $id) {
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
 
const ACTUALIZAR_PROVEEDOR = gql`
    mutation actualizarProveedor($id: ID!, $input: ProveedorInput) {
        actualizarProveedor(id: $id, input: $input) {
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

const EditarProveedor = () => {

    // const router=useRouter();
    // const {query}=router;
    // console.log(query);
    // return(
    //     <h1>desde Editar</h1>
    // );
        const router=useRouter();       
        const {pid}=router.query
        let id=pid
        console.log(id)


        // Consultar para obtener el cliente
    const { data, loading, error } = useQuery(OBTENER_PROVEEDOR, {
        variables: {
            id
        }
    });

    console.log(data)


    //actulizar el proveedor
    const [actualizarProveedor] = useMutation(ACTUALIZAR_PROVEEDOR, {
        update(cache, {data: {actualizarProveedor}}) {
          cache.writeQuery({
            query: ACTUALIZAR_PROVEEDOR,
            variables: {id},
            data: {
              obtenerProveedor: actualizarProveedor,
            }
          })
        }
      });

    // Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string() 
                    .matches(/^[aA-zZ\s]+$/, "Ingrese solo letras ")
                    .required('El nombre del cliente es obligatorio'),
        apellido: Yup.string() 
                    .matches(/^[aA-zZ\s]+$/, "Ingrese solo letras ")
                    .required('El apellido del cliente es obligatorio'),
       cedula: Yup.string() 
                    .matches(/^[0-9]+$/, "Ingrese solo numeros ")
                    .required('la cedula del cliente es obligatorio'),
        direccion: Yup.string() 
                    .matches(/^[aA-zZ\s]+$/, "Ingrese solo letras ")
                    .required('La direccion del proveedor  es obligatorio'),
        direccion: Yup.string() 
                    .required('La direccion del proveedor  es obligatorio'),
        email: Yup.string()
                    .email('Email no válido') 
                    .required('El email del cliente es obligatorio')
    });

    if(loading) return 'Cargando...'

    // console.log(data?.OBTENER_CLIENTE)
    // console.log(data?.obtenerCliente)
    //  const { obtenerCliente } = data;
    

    const { obtenerProveedor } = data;
    console.log(obtenerProveedor)
    // Modifica el cliente en la BD
    const actualizarInfoProveedor = async valores => {
        const { nombre, apellido, direccion, email,telefono,cedula } = valores;

        try {
            const { data } = await actualizarProveedor({
                variables: {
                    id,
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

            console.log(data);
  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El proveedor se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/');

        } catch (error) {
            console.log(error);
        }
    }

     
        return(
            <Layout>
             <h1 className="text-2xl text-gray-800 font-light">Editar Proveedor</h1>

             <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    
                    <Formik
                    
                    validationSchema={ schemaValidacion }
                    enableReinitialize
                   initialValues={ obtenerProveedor  }
                   onSubmit={ ( valores ) => {
                    actualizarInfoProveedor(valores)
                }}
                    >
                        {props =>{
                            // console.log(props)
                            return(

                       
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={props.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Cliente"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.nombre}
                                />
                            </div>

                            { props.touched.nombre && props.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.nombre}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Apellido Cliente"
                                    onChange={props.handleChange}
                                     onBlur={props.handleBlur}
                                    value={props.values.apellido}
                                />
                            </div>

                            { props.touched.apellido && props.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.apellido}</p>
                                </div>
                            ) : null  }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cedula">
                                    Cedula
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cedula"
                                    type="text"
                                    placeholder="Cedula del Cliente"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.cedula}
                                />
                            </div>

                            { props.touched.cedula && props.errors.cedula ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.cedula}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                    direccion
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="direccion"
                                    type="text"
                                    placeholder="Empresa Cliente"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.direccion}
                                />
                            </div>

                            { props.touched.direccion && props.errors.direccion ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.direccion}</p>
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
                                    placeholder="Email Cliente"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.email}
                                />
                            </div>

                            { props.touched.email && props.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.email}</p>
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
                                    placeholder="Teléfono Cliente"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.telefono}
                                />
                            </div>

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Editar Proveedor"
                            />
                    </form>
                         )
                        }}

                    </Formik>
                </div>
            </div>

            </Layout>
            
        )
        
    
 }
 
export default EditarProveedor;