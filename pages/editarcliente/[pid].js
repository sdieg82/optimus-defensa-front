import { useQuery, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!) {
        obtenerCliente(id: $id) {
            id
            nombre
            apellido
            cedula
            empresa
            email
            telefono
            
        }
    }
`;
 
const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput) {
        actualizarCliente(id: $id, input: $input) {
            id
            nombre
            apellido
            cedula
            empresa
            email
            telefono
            
        }
    }
`;

const EditarCliente = () => {
        const router=useRouter();       
        const {pid}=router.query
        let id=pid
        console.log(id)


        // Consultar para obtener el cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });


    //actulizar el cliente
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        update(cache, {data: {actualizarCliente}}) {
          cache.writeQuery({
            query: OBTENER_CLIENTE,
            variables: {id},
            data: {
              obtenerCliente: actualizarCliente,
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
                    .matches(/^[0-9]+$/, "Ingrese solo números ")
                    .required('La cédula del cliente es obligatorio'),
        empresa: Yup.string() 
                    .matches(/^[aA-zZ\s]+$/, "Ingrese solo letras ")
                    .required('La direccion es obligatorio'),
        email: Yup.string()
                    .email('Email no válido') 
                    .required('El email del cliente es obligatorio'),
        telefono: Yup.string() 
                    .matches(/^[0-9]+$/, "Ingrese solo números ")
                    .required('El número de teléfono del cliente es obligatorio'),
    });

    if(loading) return 'Cargando...'

    // console.log(data?.OBTENER_CLIENTE)
    // console.log(data?.obtenerCliente)
    //  const { obtenerCliente } = data;

    const { obtenerCliente } = data;

    // Modifica el cliente en la BD
    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, empresa, email,telefono,cedula } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre, 
                        apellido,
                        cedula, 
                        empresa, 
                        email,
                        telefono
                    }
                }
            });

            console.log(data);
  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El cliente se actualizó correctamente',
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
             <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

             <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    
                    <Formik
                    
                    validationSchema={ schemaValidacion }
                    enableReinitialize
                   initialValues={ obtenerCliente  }
                   onSubmit={ ( valores ) => {
                    actualizarInfoCliente(valores)
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                    Cedula 
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cedula"
                                    type="text"
                                    placeholder="Cédula del cliente"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                    Dirección
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="empresa"
                                    type="text"
                                    placeholder="Empresa Cliente"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.empresa}
                                />
                            </div>

                            { props.touched.empresa && props.errors.empresa ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.empresa}</p>
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
                                value="Editar Cliente"
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
 
export default EditarCliente;