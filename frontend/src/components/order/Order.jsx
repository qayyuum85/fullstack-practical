import React, { useState, useEffect, useRef } from "react";
import OrderForm from "./OrderForm";
import OrderList from "./OrderList";
import * as axios from "axios";

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function Order() {
    const [orders, setOrders] = useState([]);
    const [onRequest, setOnRequest] = useState(false);
    const delay = 10000;

    const getOrder = async () => {
        setOnRequest(true);
        try {
            const response = await axios.get("http://localhost:3030/order");
            setOrders(response.data);
            setOnRequest(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    // run polling
    useInterval(
        () => {
            getOrder();
        },
        onRequest ? null : delay
    );

    const createOrder = async (title, desc, price) => {
        let response;
        setOnRequest(true);
        try {
            response = await axios.post("http://localhost:3030/order", {
                title,
                description: desc,
                price,
            });

            setOrders([...orders, response.data]);
        } catch (error) {
            console.error(error);
        }
        setOnRequest(false);
    };

    const updateOrderStatus = async (id, status) => {
        setOnRequest(true);
        let response;
        try {
            response = await axios.patch(
                `http://localhost:3030/order/${id}/status`,
                { status }
            );
        } catch (error) {
            console.error(error);
        }

        const copy = [...orders];
        const idx = copy.findIndex((order) => order.id === response.data.id);

        if (idx === -1) {
            setOnRequest(false);
            return;
        }

        copy[idx].status = response.data.status;
        setOrders(copy);
        setOnRequest(false);
    };

    return (
        <div style={orderStyle}>
            <OrderForm submitForm={createOrder}></OrderForm>
            <OrderList
                orders={orders}
                updateStatus={updateOrderStatus}
            ></OrderList>
        </div>
    );
}

const orderStyle = {
    padding: "0 20px",
};

export default Order;
