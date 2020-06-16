import React, { useState } from "react";

function OrderForm({submitForm}) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");

    const handleChange = (e) => {
        switch (e.target.name) {
            case "orderTitle":
                setTitle(e.target.value);
                break;
            case "orderDesc":
                setDesc(e.target.value);
                break;
            case "orderPrice":
                setPrice(e.target.value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(title, desc, price)
    };

    return (
        <form name={"orderForm"}>
            <div style={inputContStyle}>
                <label htmlFor="orderTitle" style={labelStyle}> Title </label>
                <input
                    type="text"
                    name="orderTitle"
                    value={title}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>
            <div style={inputContStyle}>
                <label htmlFor="orderDesc" style={labelStyle}> Description </label>
                <input
                    type="text"
                    name="orderDesc"
                    value={desc}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>
            <div style={inputContStyle}>
                <label htmlFor="orderPrice" style={labelStyle}> Price </label>
                <input
                    type="number"
                    name="orderPrice"
                    value={price}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>
            <div style={inputContStyle}>
                <button style={buttonStyle} type="submit" onClick={handleSubmit}>
                    Submit Order
                </button>
            </div>
        </form>
    );
}

const inputContStyle = {
    display: "flex",
    flexFlow: "row nowrap",
    padding: "3px 0"
};

const inputStyle = {
    padding: "8px 16px",
    width: "300px",
    flex: "1 1"
};

const labelStyle = {
    flex: "0 1 100px"
}

const buttonStyle = {
    padding: "8px 16px",
    cursor: "pointer"
}

export default OrderForm;
