import { useState, useEffect } from 'react';
import './style.scss';
import { toast } from 'react-toastify';

function HotelReservItem(props) {
    const [existReservs, setExistReservs] = useState([]);
    const [newReserv, setNewReserv] = useState({
        HotelName: props.name,
        Date: props.date,
        Price: props.price,
        Time: props.time
    });

    const GetReservsFromDataBase = async () => {
        try {
            const response = await fetch("http://localhost:3000/Reservs");
            const data = await response.json();
            setExistReservs(data);
        } catch (error) {
            toast.error('Failed to load existing reservations: ' + error.message);
        }
    };


    const SendDataToDataBase = async () => {
        try {
            const response = await fetch('http://localhost:3000/Reservs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newReserv, id: Date.now() })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            toast.success('Successfully Added to DataBase!');
            GetReservsFromDataBase()
        } catch (error) {
            toast.error('Failed to add reservation: ' + error.message);
        }
    };

    const checkDataBase = async () => {
        await GetReservsFromDataBase(); 

        const hotelExists = existReservs.some(reserv => reserv.HotelName === newReserv.HotelName);

        if (hotelExists) {
            toast.error('Reservation for this hotel already exists.');
        } else {
            await SendDataToDataBase(); 
        }
    };

    useEffect(() => {
        GetReservsFromDataBase();
    }, []);

    return (
        <>
            <div className="HotelReservItemWrapper">
                <div className="HotelReservLeftSide">
                    <div className="HotelReservName">
                        {props.name}
                    </div>
                    <div className="HotelImg">
                        <img src={props.img} alt="" />
                    </div>
                </div>
                <div className="HotelReservRightSide">
                    <div className="HotelReservInfo">
                        <div className="HotelReservId">
                            <span>ID: </span>{props.id}
                        </div>
                        <div className="HotelReservTime">
                            <span>Time:</span> {props.time}
                        </div>
                        <div className="HotelReservDate">
                            <span>Date:</span> {props.date}
                        </div>
                        <div className="HotelReservPrice">
                            <span>Price: $</span> {props.price}.00
                        </div>
                    </div>
                    <div className="HotelReservText">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus nihil laudantium cumque fuga nam sapiente, ipsa soluta magni velit vel vero, quibusdam voluptatem dolores.<br /> Dolore molestiae excepturi ratione quas consectetur hic incidunt cumque autem nesciunt ipsa deserunt doloremque, asperiores alias reiciendis<br /> voluptates veritatis inventore iste tempora, ex eveniet totam praesentium.
                    </div>
                    <button onClick={checkDataBase} className="AddToReserv">
                        Add to Reserv
                    </button>
                </div>
            </div>
        </>
    );
}

export default HotelReservItem;