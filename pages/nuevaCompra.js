import Layout from "../components/Layout"
import Proveedor from "../components/Proveedor"
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'

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

const NuevaCompra = () => {

    const { data, loading, error } = useQuery(OBTENER_PROVEEDORES);
   if(loading) return 'Cargando..'
   const{obtenerProveedores}=data
   const{nombre}=obtenerProveedores
  console.log(obtenerProveedores.nombre)


  
   

    
    return (
    <>
    <Layout>
    <div className="mb-4">
                               
                               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre del Proveedor
                                </label>
                                
                              
                              

                                  { obtenerProveedores?.length === 0 ? (
                                    <p className="mt-5 text-center text-2xl">No hay proveedores aún</p>
                                  ) : (
                                    obtenerProveedores?.map( proveedor => (
                                        <Proveedor 
                                          key={proveedor.id}
                                          proveedor={proveedor}
                                        />
                                    ))  
                                  )}

{/*                                   
                                //   value={nombre}
                                    // className="mt-3"
                                    // options={ obtenerProveedores }
                                    // onChange={ opcion => seleccionarProveedor(opcion) }
                                    // // getOptionValue={ opciones => opciones.id }
                                    // getOptionLabel={ opciones => opciones.nombre + " "+ opciones.apellido}
                                    // placeholder="Busque o Seleccione el Proveer"
                                    // noOptionsMessage={() => "No hay resultados"}
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    // value={formik.values.provider} */}
                            
                               
                            </div>
    
    </Layout>
  
    </>
  )
}

export default NuevaCompra