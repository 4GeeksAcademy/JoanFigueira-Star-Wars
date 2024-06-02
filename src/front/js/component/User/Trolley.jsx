import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../../store/appContext.js';

import { UserNavbar } from '../../component/User/UserNavbar.jsx';

export const Trolley = () => {
    const { store, actions } = useContext(Context);

    const [price, setPrice] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener courseId de location.state, si está presente
    const courseId = location.state?.courseId;

    const calculateTotalPrice = () => {
        return store?.courseFavorite?.reduce((total, item) => total + item.price, 0);
    };

    useEffect(() => {
        const totalPrice = calculateTotalPrice();
        setPrice(totalPrice);
    }, [store.courseFavorite]);

    const handleCheckout = () => {
        if (courseId !== undefined) {
            navigate('/paypal', { state: { totalPrice: price, numberCourse: courseId } });
        } else {
            alert('Course ID is not available.');
        }
    };

    return (
        <div>
            <UserNavbar />
            <div className="container mt-5">
                <h1>Your Course</h1>
                <div className="col-3">
                    <h1><strong>$</strong>{price}</h1>
                </div>
                <div className="col-9">
                    {store.courseFavorite.length === 0 ? "No hay Cursos Cargados" :
                        store.courseFavorite.map((item, index) => (
                            <div key={index}>
                                <table className="table mx-auto">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Title Course</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">EDIT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">{courseId}</th>
                                            <td>{item.titleCourse}</td>
                                            <td>{item.price}</td>
                                            <td>{item.date}</td>
                                            <td onClick={() => actions.deleteTrolley(item.id)}>{"Del"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    }
                </div>

                <div className="col-12 text-right">
                    <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
                </div>
            </div>
        </div>
    );
};
