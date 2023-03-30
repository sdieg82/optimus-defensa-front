import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Select, { NonceProvider } from "react-select";

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
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

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
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

const ACTUALIZAR_PRODUCTO_COMPRA = gql`
  mutation actualizarProductoCompra($id: ID!, $input: ProductoInput) {
    actualizarProductoCompra(id: $id, input: $input) {
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

const EditarProductoCompra = () => {
  const router = useRouter();
  const { pid } = router.query;

  let id = pid;
  console.log(id);

  // console.log(id)

  // Consultar para obtener el producto
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id,
    },
  });

  // Mutation para modificar el producto
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO_COMPRA, {
    update(cache, { data: { actualizarProducto } }) {
      cache.writeQuery({
        query: OBTENER_PRODUCTO,
        variables: { id },
        data: {
          obtenerProducto: actualizarProducto,
        },
      });
    },
  });

  // Schema de validación
  const schemaValidacion = Yup.object({
    marca: Yup.string().required("La marca del producto es obligatorio"),
    modelo: Yup.string().required("El modelo del producto es obligatorio"),
    nombreProveedor: Yup.string(),
    //             // .required('El nombre del Proveedor es obligatorio')
    //             // .matches(/^[aA-zZ-á-é-í-ó-ú-Á-É-Í-Ó-Ú\s]+$/, "Ingrese solo letras "),
    nombre: Yup.string().required("El nombre del producto es obligatorio"),

    existencia: Yup.number()
      .required("Agrega la cantidad disponible")
      .positive("No se aceptan números negativos")
      .integer("La existencia deben ser números enteros"),
    precio: Yup.number()
      .required("El precio es obligatorio")
      .positive("No se aceptan números negativos"),
    precioCompra: Yup.number()
      .required("El precio es obligatorio")
      .positive("No se aceptan números negativos"),
    cantidadCompra: Yup.number()
      .required("La cantidad es obligatorio")
      .positive("No se aceptan números negativos"),
  });

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if (loading) return "Cargando...";

  if (!data) {
    return "Acción no permitida";
  }

  const actualizarInfoProducto = async (valores) => {
    // console.log(valores);
    const {
      marca,
      nombre,
      existencia,
      precio,
      modelo,
      nombreProveedor,
      precioCompra,
      cantidadCompra,
    } = valores;
    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            marca,
            modelo,
            nombreProveedor,
            nombre,
            existencia,
            precio,
            precioCompra,
            cantidadCompra,
          },
        },
      });
      // console.log(data);

      // Redirgir hacia productos
      router.push("/productos");

      // Mostrar una alerta
      Swal.fire("Correcto", "La compra se realizó correctamente", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const { obtenerProducto } = data;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Añadir Existencias Producto
      </h1>

      <div className="flex justify-center mt-5 md:grid-cols-2">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl text-gray-800 font-light">
            Añadir Existencias Producto
          </h1>

          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={actualizarInfoProducto}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Nombre del Proveedor
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombreProveedor"
                      type="text"
                      placeholder="Nombre del Proveedor"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombreProveedor}
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Código del Producto
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="marca"
                      type="text"
                      placeholder="Marca del Producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.marca}
                      readOnly="readonly"
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="modelo"
                    >
                      Modelo del Producto
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="modelo"
                      type="text"
                      placeholder="Nombre Producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.modelo}
                      readOnly="readonly"
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Tipo del Producto
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombre"
                      type="text"
                      placeholder="Nombre Producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                      readOnly="readonly"
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  {/* <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marca">
                                    Marca
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="marca"
                                    type="text"
                                    placeholder="Marca Producto"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    value={props.values.marca}
                                />
                            </div>

                            { props.touched.marca && props.errors.marca ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{props.errors.marca}</p>
                                </div>
                            ) : null  }  */}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="existencia"
                    >
                      Cantidad Disponible
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="existencia"
                      type="number"
                      placeholder="Cantidad Disponible"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                      readOnly="readonly"
                    />
                  </div>

                  {props.touched.existencia && props.errors.existencia ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.existencia}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="precio"
                    >
                      Precio
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="precio"
                      type="number"
                      placeholder="Precio Producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                      readOnly="readonly"
                    />
                  </div>

                  {props.touched.precio && props.errors.precio ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}
                </form>
              );
            }}
          </Formik>
        </div>
        <div className="flex justify-center mt-5 ">
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={actualizarInfoProducto}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="cantidadCompra"
                    >
                      Ingrese la cantidad a Comprar
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="cantidadCompra"
                      type="number"
                      placeholder="Cantidad a Comprar"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.cantidadCompra}
                    />
                  </div>

                  {props.touched.cantidadCompra &&
                  props.errors.cantidadCompra ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.cantidadCompra}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="precioCompra"
                    >
                      Precio de la Compra
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="precioCompra"
                      type="number"
                      placeholder="Precio Compra"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precioCompra}
                    />
                  </div>

                  {props.touched.precioCompra && props.errors.precioCompra ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.precioCompra}</p>
                    </div>
                  ) : null}
                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    value="Realizar Compra"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProductoCompra;
