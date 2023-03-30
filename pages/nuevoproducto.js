import React,{useState, useEffect} from 'react';
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {gql, useMutation, useQuery} from '@apollo/client' 
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import Select from 'react-select'
import Proveedor from '../components/Proveedor';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            marca
            modelo
            nombreProveedor
            nombre
            existencia
            precio 
            precioCompra 
            cantidadCompra 
            creado   
        }
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
          
      }
  }
`;



const OBTENER_PROVEEDORES = gql`
    query obtenerProveedores {
        obtenerProveedores {
            id  
            nombre
            apellido
            direccion
            cedula
            email
            telefono
          }
    }

`;

 
const NuevoProducto = () => {
    
    // routing
   
    const router = useRouter();
    const [provider, setProvider ] = useState(undefined);
    const [mensaje, guardarMensaje] = useState(null);
    const { loading, error, data,refetch } = useQuery(OBTENER_PROVEEDORES);
    const obtenerProveedores = data?.obtenerProveedores;
    
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            // obtener el objeto de cache
            const data = cache.readQuery({ query: OBTENER_PRODUCTOS });
            const obtenerProductos = data?.obtenerProductos || []; // asegurarse de que "obtenerProductos" no sea nulo
        
            // reescribir ese objeto
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos,nuevoProducto]
                }
            });
        }
    });
    
    
    const seleccionarProveedor = proveedores => {
        const nameProvider = proveedores.nombre + ' '+ proveedores.apellido;
        setProvider(nameProvider);
    }
    
    const formik = useFormik({
        initialValues: {
            marca:'',
            modelo:'',
            nombreProveedor:provider,
            nombre: '',
            existencia: '',
            precio: '',
            precioCompra: '',
            cantidadCompra: '',
        },
        validationSchema: Yup.object({
            marca: Yup.string() 
                        .required('El codigo del producto es obligatorio'),
            modelo: Yup.string() 
                        .required('El modelo del producto es obligatorio'),  
            nombreProveedor: Yup.string(),
            nombre: Yup.string() 
                        .required('El nombre del producto es obligatorio'),
            existencia: Yup.number()
                        .required('Agrega la cantidad disponible')
                        .positive('No se aceptan números negativos')
                        .integer('La existencia deben ser números enteros'),
            precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos'),
            precioCompra: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos'),
            cantidadCompra: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos'),
        }), 
        onSubmit: async valores => {
            console.log(valores);
            const {marca, nombre,existencia, precio,modelo,nombreProveedor,precioCompra,cantidadCompra} = valores;

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            marca,
                            modelo,
                            nombreProveedor:provider,
                            nombre,
                            existencia,
                            precio,
                            precioCompra,
                            cantidadCompra                           
                        }
                    }
                });

               console.log(data);

                // Mostrar una alerta
                Swal.fire(
                    'Creado',
                    'Se creó el producto correctamente',
                    'success'
                )

                // Redireccionar hacia los productos
                router.push('/productos'); 
                refetch(); // Agrega esta línea
            } catch (error) {
                 guardarMensaje(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
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
            <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Producto</h1>
            {mensaje && mostrarMensaje() }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                             <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un proveedor para la compra</p>

                             <Select
                                    className="mt-3"
                                    options={ obtenerProveedores }
                                    onChange={ opcion => seleccionarProveedor(opcion) }
    
                                    getOptionLabel={ opciones => opciones.nombre + " "+ opciones.apellido}
                                    
                            />  
                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 p-2" htmlFor="marca">
                                    Código del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="marca"
                                    type="text"
                                    placeholder="Código del producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.marca}
                                />
                            </div>

                            { formik.touched.marca && formik.errors.marca ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.marca}</p>
                                </div>
                            ) : null  }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="modelo">
                                    Modelo del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="modelo"
                                    type="text"
                                    placeholder="Modelo del producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.modelo}
                                />
                            </div>

                            { formik.touched.modelo && formik.errors.modelo ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.modelo}</p>
                                </div>
                            ) : null  }
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre del Producto
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre del Producto"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Cantidad
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="existencia"
                                    type="number"
                                    placeholder="Cantidad Disponible"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.existencia}
                                />
                            </div>

                            { formik.touched.existencia && formik.errors.existencia ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.existencia}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidadCompra">
                                    Cantidad Compra
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantidadCompra"
                                    type="number"
                                    placeholder="Cantidad Compra"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cantidadCompra}
                                    
                                />
                            </div>

                            { formik.touched.cantidadCompra && formik.errors.cantidadCompra ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cantidadCompra}</p>
                                </div>
                            ) : null  }

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Precio de Compra
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precioCompra"
                                    type="number"
                                    placeholder="Precio Compra Disponible"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precioCompra}
                                   
                                />
                            </div>

                            { formik.touched.precioCompra && formik.errors.precioCompra ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precioCompra}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="precio"
                                    type="number"
                                    placeholder="Precio Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.precio}
                                />
                            </div>

                            { formik.touched.precio && formik.errors.precio ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ) : null  }
                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Agregar Nuevo Producto"
                            />
                    </form>
                </div>
            </div>
        </Layout>
     );
    
}
 
export default NuevoProducto;