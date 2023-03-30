import Layout from '../components/Layout';
import Compra from '../components/Compra';
import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'

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
          precioCompra
          cantidadCompra
          
      }
  }
`;

const Compras = () => {

  // Consultar los productos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS)

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return 'cargando...';


  return (
    <>
    <div>
      <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Registro de Compras</h1>
         
        
          
          <Link href="/nuevoproducto">
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
              Nueva Compra
            </a>
          </Link>

          <table className="table-auto shadow-md mt-10 w-full w-lg">
            

            <tbody className="">
            
              {data?.obtenerProductos.map( producto => (
                <Compra 
                  key={producto.id}
                  producto={producto}
                />
              ))}
              
            </tbody>
          </table>

      </Layout>
    </div>
  </>
  )
}

export default Compras
