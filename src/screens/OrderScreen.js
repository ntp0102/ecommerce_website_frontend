import React, { useState, useEffect } from "react";

/* REACT ROUTER */
import { Link } from "react-router-dom";

/* REACT BOOTSTRAP */
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";

/* PAYPAL BUTTONS */
// import { PayPalButton } from "react-paypal-button-v2";

/* COMPONENTS */
import Message from "../components/Message";
import Loader from "../components/Loader";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import {
    payOrder,
} from "../redux/slices/orderSlice";

import { getOrderDetails } from "../redux/slices/orderSlice";

function OrderScreen({ match, history }) {

    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState(false);

    /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
    const order = useSelector((state) => state.order);
    const { listOrder, orderDetails, error, loading } = order;
    // const orderPay = useSelector((state) => state.orderPay);
    // const { loading: loadingPay, success: successPay } = orderPay;

    // const orderDeliver = useSelector((state) => state.orderDeliver);
    // const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.user);
    const { userDetails } = userLogin;

    // let updatedOrderDetails = orderDetails;

    // if (updatedOrderDetails && updatedOrderDetails.orderItems && updatedOrderDetails.orderItems.length > 0) {
    //     const itemsPrice = updatedOrderDetails.orderItems.reduce(
    //         (acc, item) => acc + item.price * item.qty,
    //         0
    //     ).toFixed(0);

    //     updatedOrderDetails = { ...updatedOrderDetails, itemsPrice };
    // }


    // PAYPAL BUTTONS
    const addPayPalScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
            "https://www.paypal.com/sdk/js?client-id=AYgflmsaM7ccNLPlKUiufIyw8-spOE4UuS5XyyTCvhzheA-1EUcZF9qGlgXBZaSKcP5BY0zTc9WgINKe";
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        // IS USER IS NOT LOGGED IN THEN REDIRECT TO LOGIN PAGE
        if (!userDetails) {
            history.push("/login");
        }
        else {
            dispatch(getOrderDetails(match.params.id));
            if (!orderDetails.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
        // else if (!orderDetails.isPaid) {
        //     // ACTIVATING PAYPAL SCRIPTS
        //     if (!window.paypal) {
        //         addPayPalScript();
        //     } else {
        //         setSdkReady(true);
        //     }
        // }
    }, [dispatch, history, match, orderDetails.isPaid, userDetails]);

    // Calculate the total price of each individual item
    const calculateItemsPrice = () => {
        if (orderDetails.orderItems && orderDetails.orderItems.length > 0) {
            return orderDetails.orderItems.reduce((total, item) => {
                const itemPrice = parseFloat(item.price) * item.qty;
                return total + itemPrice;
            }, 0);
        }
        return 0;
    };

    // Call the calculateItemsPrice method to get the total price
    const itemsPrice = calculateItemsPrice();

    /* HANDLERS */
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderDetails._id, paymentResult));
    };



    return loading ? (
        <Loader />
    ) : error ? (
        <Message
            variant="error"
            children={error}></Message>
    ) : (
        <div>
            <h1>Order:</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>

                            <p>
                                <strong>Name: {orderDetails.User.name}</strong>
                            </p>

                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${orderDetails.User.username}`}>{orderDetails.User.username}</a>
                            </p>

                            <p>
                                <strong>Shipping Address: </strong>
                                {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city},{" "}
                                {orderDetails.shippingAddress.postalCode},{" "}
                                {orderDetails.shippingAddress.country}
                            </p>

                            {orderDetails.isDeliver ? (
                                <Message variant="success">
                                    Delivered on{" "}
                                    {orderDetails.deliveredAt
                                        ? orderDetails.deliveredAt.substring(0, 10)
                                        : null}
                                </Message>
                            ) : (
                                <Message variant="warning">Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment</h2>

                            <p>
                                <strong>Payment Method: </strong>
                                {orderDetails.paymentMethod}
                            </p>

                            {orderDetails.isPaid ? (
                                <Message variant="success">
                                    Paid   {orderDetails.paidAt ? orderDetails.paidAt.substring(0, 10) : null}
                                </Message>
                            ) : (
                                <Message variant="warning">Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>

                            {orderDetails.orderItems.length === 0 ? (
                                <Message variant="info">Order is empty</Message>
                            ) : !orderDetails.orderItems.length ? <></> : (
                                <ListGroup variant="flush">
                                    {orderDetails.orderItems.map((item, index) => (
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
                                                    <a href={`/product/${item.product}`}>
                                                        {item.name}
                                                    </a>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} X {Math.trunc(item.price)} VND = {(item.qty * item.price).toFixed()} VND

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
                                    <Col>Products Cost:</Col>

                                    <Col>{Math.trunc(itemsPrice)} VND</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>

                                    <Col>{Math.trunc(orderDetails.shippingPrice)} VND</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>

                                    <Col>{Math.trunc(orderDetails.taxPrice)} VND</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>

                                    <Col>{Math.trunc(orderDetails.totalPrice)} VND</Col>
                                </Row>
                            </ListGroup.Item>

                            {/* {!orderDetails.isPaid && (
                                <ListGroup.Item>
                                    {loading && <Loader />}
                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={orderDetails.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )} */}
                        </ListGroup>


                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderScreen;