import React from "react";
import OrderItem from "./OrderItem";

function OrderList({ orders, updateStatus }) {
    return (
        <div style={orderCont}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th width="1%">No</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th width="10%">Created On/Last Updated</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, orderIdx) => {
                        return (
                            <OrderItem
                                key={order.id}
                                order={order}
                                count={orderIdx + 1}
                                updateStatus={updateStatus}
                            ></OrderItem>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ddd",
};

const orderCont = {
    overflowY: "auto",
};

export default OrderList;
