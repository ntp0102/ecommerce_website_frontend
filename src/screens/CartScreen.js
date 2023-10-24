import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { removeFromCart } from "../redux/slices/cartSlice";
// import { incrementQty } from "../redux/slices/cartSlice";


function CartScreen({ history }) {
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };



    const checkoutHandler = () => {
        history.push("/login?redirect=shipping");
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant="info">
                        Your cart is empty. <a href="/">Go Back</a>
                    </Message>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            // <ListGroup.Item key={item.product}>
                            <ListGroup.Item key={item._id}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col m={3}>
                                        <a href={`/product/${item._id}`}>{item.name}</a>
                                    </Col>
                                    <Col>{item.qty}</Col>
                                    {/* <Col><i onClick={() => incrementQtyHandler(item._id)}
                                        style={{ cursor: 'pointer', background: 'red' }}
                                        className="bi bi-caret-up-fill"></i>
                                    </Col> */}
                                    <Col>{Math.trunc(item.price)} VND</Col>
                                    <Col md={1}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => removeFromCartHandler(item._id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </Button>    
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})
                                items
                            </h2>

                            {cartItems
                                .reduce((acc, item) => acc + Number(item.qty) * Number(item.price), 0)
                                .toFixed(0)} VND
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup.Item>
                        <Button
                            type="button"
                            className="w-100"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>
                </Card>
            </Col>
        </Row>
    );
}

export default CartScreen;