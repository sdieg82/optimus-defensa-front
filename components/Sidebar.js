import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';

const Sidebar = () => {

    // routing de next
    const router = useRouter();

    // console.log(router.pathname)

    return ( 
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5" >
            <div>
                <p className="text-white text-2xl font-black">Optimus</p>
                
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/">
                        <a className="text-white block">
                            Clientes
                        </a>
                    </Link>
                </li>
               
                <li className={router.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/productos">
                        <a className="text-white block">
                            Productos
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/proveedores" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/proveedores">
                        <a className="text-white block">
                        Proveedores
                        </a>
                    </Link>
                </li>
            </nav>

            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">Panel de Control</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/mejoresclientes" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/mejoresclientes">
                        <a className="text-white block">
                            Mejores Clientes
                        </a>
                    </Link>
                </li>

                <li className={router.pathname === "/bajoStock" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/bajoStock">
                        <a className="text-white block">
                        Bajo Stock
                        </a>
                    </Link>
                </li>

            </nav>

            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">Registros</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/pedidos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/pedidos">
                        <a className="text-white block">
                            Registro de ventas a clientes
                        </a>
                    </Link>
                </li>


            </nav>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/comprasProveedores" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/compras">
                        <a className="text-white block">
                            Registro de compras a proveedores
                        </a>
                    </Link>
                </li>


            </nav>
            

           
        </aside>
     );
}
 
export default Sidebar; 