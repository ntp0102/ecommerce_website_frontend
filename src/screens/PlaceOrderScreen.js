import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, getOrderDetails } from "../redux/slices/orderSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { fetchUserDetails } from "../redux/slices/userSlice";
import { current } from "@reduxjs/toolkit";
import Swal from 'sweetalert2';


function PlaceOrderScreen({ history }) {
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);
    const { listOrder, orderDetails, loading, error } = order;
    const cart = useSelector((state) => state.cart);
    // PRICE CALCULATIONS
    const itemsPrice = cart.cartItems.reduce(
        (acc, item) => acc + Number(item.price) * item.qty,
        0
    );

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.1 * itemsPrice).toFixed(0));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(0);

    if (!cart.paymentMethod) {
        history.push("/payment");
    }



    const data = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice.toFixed().toString(),
        shippingPrice: shippingPrice.toFixed().toString(),
        taxPrice: taxPrice.toFixed().toString(),
        totalPrice: totalPrice.toString(),
    };


    let disableButtonPlaceOrder = false;

    const placeOrder = async () => {
        disableButtonPlaceOrder = true;
        dispatch(createOrder(data))
            .then((orderId) => {
                setTimeout(function () {
                }, 1500);
                history.push(`/orderDetail/${orderId}`);
            })
            .catch((error) => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'An error occurred while placing your order, please try again or contact us',
                    showConfirmButton: false,
                    timer: 2000
                });
                // Handle any error that occurred during order creation
            });
        disableButtonPlaceOrder = false;
    };

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                                {cart.shippingAddress.postalCode},{" "}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <p>
                                <strong>Payment Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message variant="info">Your cart is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <a href={`/product${item.product}`}>
                                                        {item.name}
                                                    </a>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {Number(item.price).toFixed(0)} VND = &nbsp;
                                                    {(item.qty * Number(item.price)).toFixed(0)} VND
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>{itemsPrice} VND</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>{shippingPrice} VND</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>{taxPrice} VND</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>{totalPrice} VND</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant="error">{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="w-100"
                                    disabled={(cart.cartItems.length === 0) || (disableButtonPlaceOrder)}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PlaceOrderScreen;