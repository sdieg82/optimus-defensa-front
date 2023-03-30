import Layout from "../components/Layout";
import Cliente from "../components/Cliente";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
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

const Index = () => {
  // Consulta de Apollo
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
  // console.log(data)
  // console.log(loading)
  // console.log(error)

  //if(loading) return 'Cargando....';

  

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <Link href="/nuevocliente">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
            Nuevo Cliente
          </a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/6 py-2">Nombres y Apellidos</th>
                <th className="w-1/6 py-2">Cédula</th>
                <th className="w-1/6 py-2">Teléfono</th>
                <th className="w-1/6 py-2">Dirección</th>
                <th className="w-1/6 py-2">Email</th>
                <th className="w-1/6 py-2">Editar</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data?.obtenerClientesVendedor.map((cliente) => (
                <Cliente key={cliente.id} cliente={cliente} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
