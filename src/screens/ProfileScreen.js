import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, updateUser } from "../redux/slices/userSlice";
import { listMyOrders, getOrderDetails } from "../redux/slices/orderSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import CancelIcon from '@mui/icons-material/Cancel';


function ProfileScreen({ history }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { userDetails, loading, error } = user;
    const userData = {
        id: userDetails._id,
        name: name,
        email: email,
        password: password,
    };

    const order = useSelector((state) => state.order);
    const { listOrder, orderDetails, loading: loadingOrders, error: errorOrders } = order;
    const updatedListOrder = [...listOrder];
    useEffect(() => {
        if (!userDetails) {
            history.push("/login");
        } else {
            dispatch(listMyOrders());
            setName(userDetails.name);
            setEmail(userDetails.username);
        }
    }, [dispatch, history, userDetails, error]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(updateUser(userDetails.id, userData));
            setMessage("");
        }
    };

    const handleDeleteUser = () => {
        // Call the deleteUser action from userSlice
        dispatch(deleteUser(userDetails.id));
        history.push('/');
        window.location.reload(); // Reload the page

    };
    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type="name"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="passwordConfirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-3">
                        Update
                    </Button>

                </Form>
                <Button type="submit" variant="danger" className="mt-3" onClick={handleDeleteUser}>
                    <div style={{ fontSize: "7px" }}><CancelIcon />  Account </div>
                </Button>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger">{errorOrders}</Message>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                            </tr>
                        </thead>

                        <tbody>
                            {updatedListOrder.reverse()
                                // .filter((order) => order.isPaid) // Filter out unpaid orders
                                .map((order) => (
                                    <tr key={order._id}>
                                        {/* <td>{listOrder.indexOf(order) + 1}</td> */}
                                        <td>{order.createdAt ? order.createdAt.substring(0, 10) : null}</td>
                                        <td>{Math.trunc(order.totalPrice)} VND</td>
                                        <td>
                                            {order.isPaid ? (
                                                order.paidAt ? (
                                                    order.paidAt.substring(0, 10)
                                                ) : null
                                            ) : (
                                                <i className="fas fa-times"
                                                    style={{ color: "red" }}></i>
                                            )}
                                        </td>
                                        <td>
                                            <LinkContainer to={`/orderDetail/${order._id}`}>
                                                <Button className="btn-sm"
                                                // onClick={() => dispatch(getOrderDetails(order._id))}
                                                >Details
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row >
    );
}

export default ProfileScreen;