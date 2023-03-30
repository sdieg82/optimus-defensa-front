import Layout from "../components/Layout";
import Producto from "../components/Producto";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";

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

const Productos = () => {
  // Consultar los productos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
  const {
    loading: load2,
    error: error2,
    data: data2,
  } = useQuery(OBTENER_PROVEEDORES);
  const router = useRouter();
  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if (loading) return "cargando...";

  const onHandleNuevoProducto = () => {
    console.log(load2);
    if (!load2) router.push("/nuevoproducto");
  };

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>

        {/*<Link href="/nuevoproducto">*/}
        <a
          onClick={onHandleNuevoProducto}
          className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm "
        >
          Nueva Compra
        </a>
        {/*</Link>*/}

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/8 py-2">Nombre Proveedor</th>
              <th className="w-1/8 py-2">Nombre del Producto</th>
              <th className="w-1/8 py-2">Código</th>
              <th className="w-1/8 py-2">Modelo</th>
              {/* <th className="w-1/7 py-2">Marca</th> */}
              <th className="w-1/8 py-2">Existencia</th>
              <th className="w-1/8 py-2">Precio de venta</th>
              <th className="w-1/8 py-2">Editar</th>
              <th className="w-1/8 py-2">Comprar</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data?.obtenerProductos.map((producto) => (
              <Producto key={producto.id} producto={producto} />
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default Productos;
