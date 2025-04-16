import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import whithReactContent from 'sweetalert2-react-content'
import { show_alert } from '../functions'

const ShowProducts = () => {
    const url = 'http://localhost:8082/api/productos'
    const [productos, setProductos] = useState([])
    const [id, setId] = useState('')
    const [codigo, setCodigo] = useState('')
    const [nombre, setNombre] = useState('')
    const [stock_inicial, setStock_inicial] = useState('')
    const [stock_actual, setStock_actual] = useState('')
    const [umbral_minimo, setUmbral_minimo] = useState('')
    const [categoria, setCategoria] = useState('')
    const [operacion, setOperacion] = useState(1);
    const [titulo, setTitulo] = useState('')

    useEffect(() => {
        getProductos()
    }, [])

    const getProductos = async () => {
        const response = await axios.get(url)
        setProductos(response.data)
    }

    const openModal = (operacion, id, codigo, nombre, stock_inicial, stock_actual, umbral_minimo, categoria) => {
        setId('')
        setCodigo('')
        setNombre('')
        setStock_inicial('')
        setStock_actual('')
        setUmbral_minimo('')
        setCategoria('')
        setOperacion(operacion)

        if(operacion === 1){
            setTitulo('Agregar Producto')
        }
        else if(operacion === 2){
            setTitulo('Actualizar Producto')
            setId(id)
            setCodigo(codigo)
            setNombre(nombre)
            setStock_inicial(stock_inicial)
            setStock_actual(stock_actual)
            setUmbral_minimo(umbral_minimo)
            setCategoria(categoria)
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus()
        }, 500)
    }

    const validar = () => {
        var parametros;
        var metodo;
        if(codigo.trim() === ''){
            show_alert('Ingrese el codigo del producto', 'warning')
        }
        else if(nombre.trim() === ''){
            show_alert('Ingrese el nombre del producto', 'warning')
        }
        else{
            if(operacion === 1){
                parametros = {
                    codigo: codigo,
                    nombre: nombre,
                    stock_inicial: stock_inicial,
                    stock_actual: stock_actual,
                    umbral_minimo: umbral_minimo,
                    categoria: categoria
                }
                metodo = 'POST'
            }
            else{
                parametros = {
                    codigo: codigo,
                    nombre: nombre,
                    stock_inicial: stock_inicial,
                    stock_actual: stock_actual,
                    umbral_minimo: umbral_minimo,
                    categoria: categoria
                }
                metodo = 'PUT'
            }
            enviarSolicitud(metodo, parametros)
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        try {
            const endpoint = metodo === 'PUT' ? `${url}/${id}` : url; // Agrega el ID en la URL para PUT
            const response = await axios({
                method: metodo,
                url: endpoint,
                data: parametros
            });
    
            console.log(response); // Verifica la respuesta del servidor
    
            // Mensajes personalizados en el frontend
            const tipo = 'success'; // Asume que la operación fue exitosa
            const msj = metodo === 'POST' 
                ? 'Producto agregado correctamente' 
                : 'Producto actualizado correctamente';
    
            show_alert(msj, tipo); // Muestra el mensaje al usuario
    
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click(); // Cierra el modal
                getProductos(); // Actualiza la tabla
            }
        } catch (error) {
            // Mensaje de error en caso de fallo
            show_alert("Error en la solicitud. Intente nuevamente.", 'error');
            console.error(error); // Muestra el error en la consola
        }
    };

    const deleteProduct = (id, nombre) => {
        const Myswal = whithReactContent(Swal);
        Myswal.fire({
            title: `¿Estás seguro de eliminar el producto "${nombre}"?`,
            icon: 'question',
            text: 'Esta acción no se puede deshacer',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${url}/${id}`);
                    console.log(response); // Verifica la respuesta del servidor
    
                    // Mensaje personalizado en el frontend
                    const tipo = 'success'; // Asume que la operación fue exitosa
                    const msj = `Producto "${nombre}" eliminado correctamente`;
    
                    show_alert(msj, tipo); // Muestra el mensaje al usuario
                    getProductos(); // Actualiza la tabla
                } catch (error) {
                    // Mensaje de error en caso de fallo
                    show_alert("Error al eliminar el producto. Intente nuevamente.", 'error');
                    console.error(error); // Muestra el error en la consola
                }
            }
        });
    };

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                            <i className='fa-solid fa-circle-plus'></i>Añadir Producto
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CODIGO</th>
                                    <th>NOMBRE</th>
                                    <th>STOCK INICIAL</th>
                                    <th>STOCK ACTUAL</th>
                                    <th>UMBRAL MINIMO</th>
                                    <th>CATEGORIA</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {
                                    productos.map((producto, i) =>(
                                        <tr key={producto.id}>
                                            <td>{i+1}</td>
                                            <td>{producto.codigo}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.stock_inicial}</td>
                                            <td>{producto.stock_actual}</td>
                                            <td>{producto.umbral_minimo}</td>
                                            <td>{producto.categoria}</td>
                                            <td>
                                                <button onClick={() => openModal(2, producto.id,producto.codigo, producto.nombre, producto.stock_inicial,producto.stock_actual, producto.umbral_minimo, producto.categoria)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                <button onClick={() => deleteProduct(producto.id, producto.nombre)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id = 'modalProducts' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{titulo}</label>
                        <button type='button' id='btnCerrar' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type="text" id='codigo' className='form-control' placeholder='Codigo del producto' value={codigo} onChange={(e) => setCodigo(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type="text" id='nombre' className='form-control' placeholder='Nombre del producto' value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type="text" id='stock_inicial' className='form-control' placeholder='Stock inicial del producto' value={stock_inicial} onChange={(e) => setStock_inicial(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type="text" id='stock_actual' className='form-control' placeholder='Stock actual del producto' value={stock_actual} onChange={(e) => setStock_actual(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type="text" id='umbral_minimo' className='form-control' placeholder='Umbral minimo del producto' value={umbral_minimo} onChange={(e) => setUmbral_minimo(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type="text" id='categoria' className='form-control' placeholder='Categoria del producto' value={categoria} onChange={(e) => setCategoria(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowProducts