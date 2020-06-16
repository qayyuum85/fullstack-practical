import React from "react";
import Moment from "react-moment";

function OrderItem({ order, count, updateStatus }) {
    const handleChange = (e, id) => {
        updateStatus(id, e.target.value);
    };

    const SelectStatus = (props) => {
        return (
            <select onChange={(e) => handleChange(e, props.orderId)}>
                <option value=""></option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
        );
    };

    return (
        <tr key={order.id}>
            <td>{count}</td>
            <td>{order.title}</td>
            <td>{order.description}</td>
            <td>{order.price}</td>
            <td>
                <Moment format="DD/MM/YYYY HH:MM">{order.updatedOn ? order.updatedOn : order.createdOn}</Moment>
            </td>
            <td>
                {order.status === "CREATED" && (
                    <SelectStatus orderId={order.id}></SelectStatus>
                )}
                {order.status !== "CREATED" && order.status}
            </td>
        </tr>
    );
}

export default OrderItem;
