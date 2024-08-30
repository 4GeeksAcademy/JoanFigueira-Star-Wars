import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from '../store/appContext'
import ReactStars from 'react-rating-stars-component';
import Swal from 'sweetalert2'
import defaultAvatar from "../../img/avatar.jpg";



const Profesionales = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()


    useEffect(() => {
      //  actions.obtenerEspecialidadesPorProfesional();
        // Cargar el script de Calendly
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        const checkLoggedStatus = async () => {
         //  await actions.obtenerEspecialidadesPorProfesional();
            try {
                const logged = await actions.validToken(); // Esperar a que la promesa se resuelva

                if (!logged) {
                    Swal.fire({
                        title: 'Sesión expirada',
                        text: 'Debes logearte nuevamente',
                        icon: 'error',
                        timer: 4000
                    })
                    navigate('/vista-login');
                }
            } catch (error) {
                console.error('Error al validar token:', error);
                navigate('/vista-login'); // Redirigir en caso de error
            }
        };

        checkLoggedStatus();

        return () => {
            // Limpiar el script al desmontar el componente
            document.body.removeChild(script);
        };
    }, []);

useEffect(() => {
// actions.getPsicologos()
     actions.obtenerEspecialidadesPorProfesional();
 
},[store.psicologos])
    const openCalendly = (profesional) => {

        switch (profesional) {
            case 'Juan Pérez':
                Calendly.showPopupWidget('https://calendly.com/hablemosuy1234/dr-juan-perez');
                break;
            case 'Luis Rodríguez':
                Calendly.showPopupWidget('https://calendly.com/hablemosuy1234/dr-luis-rodriguez');
                break;
            case 'María García':
                Calendly.showPopupWidget('https://calendly.com/hablemosuy1234/dra-maria-garcia');
                break;
            case 'Ana Martínez':
                Calendly.showPopupWidget('https://calendly.com/hablemosuy1234/dra-ana-martinez');
                break;
            case 'Carlos Gómez':
                Calendly.showPopupWidget('https://calendly.com/hablemosuy1234/dr-carlos-gomez');
                break;
            default:
                break;
        }
        actions.getMeetsUser(store.dataUser.correo)
    };


    return (
        <div className="mt-5">
            {store.psicologos.map((elm, index) => (
                <div className='d-flex justify-content-center' key={index}>
                    <div className="card profesional mb-3 text-start col-10 col-md-8">
                        <div className="row g-0 h-100">
                            <div className="col-12 col-md-4">
                                <img
                                    src={elm.foto == null ? defaultAvatar : elm.foto }
                                    className="img-fluid rounded-start"
                                    alt={elm.nombre}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center'
                                    }}
                                />
                            </div>
                            <div className="col-12 col-md-8">
                                <div className="card-body position-relative">
                                    <h5 className="card-title my-3 text-inicio">{elm.nombre_usuario} {elm.apellido}</h5>
                                    <p className="card-text">
                                        <small className="text-body-secondary">{elm.descripcion}</small>
                                    </p>
                                </div>
                                <div >
                                     <div className="card-text">
                                    
                                        <ul className="d-flex flex-row gap-3">
                                            {Array.isArray(elm.especialidades) && elm.especialidades.length > 0 ? (
                                                elm.especialidades.map((especialidad) => (
                                                    <li id="nombreEspecialidad1" key={especialidad?.id}>
                                                    
                                                        {especialidad.nombre}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No hay especialidades disponibles.</li>
                                            )}
                                        </ul>
                                    </div> 
                                    
                                    <div className="button-container mt-5">
                                        <button
                                            type="button"
                                            onClick={() => openCalendly(`${elm.nombre_usuario} ${elm.apellido}`)}
                                            className="btn custom-btn"
                                        >
                                            Reservar agenda
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Profesionales