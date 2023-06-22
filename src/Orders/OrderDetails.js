import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getOrderDetails from "../services/getOrderDetails";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import PageTitle from "../Common/PageTitle";
import truck from "./truck.svg";
import card from "./card.svg";

const options = { day: "2-digit", month: "2-digit", year: "2-digit" };


const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const handleOrderDetails = useCallback(async (orderId) => {
    console.log(orderId);
    const orderDetails = await getOrderDetails(orderId);
    if (orderDetails.success) {
      setOrderDetail(orderDetails.orderDetails);
    }
    console.log("orderI", orderDetails);
  }, []);
  useEffect(() => {
    if (orderId) {
      handleOrderDetails(orderId);
    }
  }, [orderId]);

  return (
    <Container maxWidth="xl" style={{ marginTop: "2rem" ,marginBottom: "2rem" }}>
      <Box style={{ display: "flex" }}>
        <PageTitle title="Order Details" route="/dashboard/orders" />
      </Box>
      {orderDetail && (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Card
              style={{
                padding: "1rem",
              }}
            >
              <CardHeader
                title={`Order Details`}
                style={{ fontSize: "1.3rem" }}
              />
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    Date Added
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    {new Date(orderDetail.createdAt).toLocaleDateString(
                      "en-GB",
                      options
                    )}
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    Payment Status
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    {orderDetail.paymentStatus}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Card
              style={{
                padding: "1rem",
              }}
            >
              <CardHeader
                title={`Customer Details`}
                style={{ fontSize: "1.3rem" }}
              />
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    Customer
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    {orderDetail.customerName}
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    Email
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    {orderDetail.customerEmail}
                  </Grid>
                  {/* <Grid item xs={6} sm={6} md={6} lg={6}>
                Phon
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                    {orderDetail.paymentStatus}
                </Grid> */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Card
              style={{
                padding: "1rem",
              }}
            >
              <CardHeader title={`Documents`} style={{ fontSize: "1.3rem" }} />
              <CardContent>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    Invoice
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    #invoice
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    Shipping Id
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    #Shipping Id
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card
                  style={{
                    padding: "1rem",
                    position: "relative",
                  }}
                >
                  <CardHeader
                    title="Billing Address"
                    style={{
                      fontSize: "1.3rem",
                      position: "inherit",
                      zIndex: 1000,
                    }}
                  />
                  <CardContent style={{ position: "inherit", zIndex: 1000 }}>
                    <Typography variant="body1">
                      {orderDetail.shippingAddress.name},{" "}
                      {orderDetail.shippingAddress.companyName}
                    </Typography>
                    {orderDetail.shippingAddress.address1.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.address1}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.address2.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.address2}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.locality.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.locality}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.city.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.city}(
                        {orderDetail.shippingAddress.pincode})
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.state.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.state}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.phoneNumber.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.phoneNumber}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.gst.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.gst}
                      </Typography>
                    )}
                  </CardContent>
                  <div style={{ position: "absolute", top: 0, right: 0 }}>
                    <img src={card} style={{ color: "grey" }} />
                  </div>
                </Card>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Card
                  style={{
                    padding: "1rem",
                    position: "relative",
                  }}
                >
                  <CardHeader
                    title="Shipping Address"
                    style={{
                      fontSize: "1.3rem",
                      position: "inherit",
                      zIndex: 1000,
                    }}
                  />
                  <CardContent style={{ position: "inherit", zIndex: 1000 }}>
                    <Typography variant="body1">
                      {orderDetail.shippingAddress.name},{" "}
                      {orderDetail.shippingAddress.companyName}
                    </Typography>
                    {orderDetail.shippingAddress.address1.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.address1}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.address2.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.address2}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.locality.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.locality}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.city.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.city}(
                        {orderDetail.shippingAddress.pincode})
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.state.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.state}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.phoneNumber.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.phoneNumber}
                      </Typography>
                    )}
                    {orderDetail.shippingAddress.gst.length > 3 && (
                      <Typography variant="body1">
                        {orderDetail.shippingAddress.gst}
                      </Typography>
                    )}
                  </CardContent>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    <img src={truck} />
                  </div>
                </Card>
              </Grid>
            </Grid>
          </Container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Card
              style={{
                padding: "1rem",
                position: "relative",
              }}
            >
              <CardHeader
                title={`Order - ${orderDetail.orderId}`}
                style={{
                  fontSize: "1rem",
                  position: "inherit",
                  zIndex: 1000,
                }}
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Product ID</TableCell>
                    <TableCell>QTY</TableCell>
                    <TableCell>UNIT PRICE</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetail.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Box style={{ display: "flex" }}>
                          <img
                            src={item.moreDetails.productPrimaryImage}
                            alt={item.name}
                            height={100}
                          />
                          <Typography variant="subtitle1" style={{margin:"5px", display:"flex",alignItems:"center"}}>
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{item.productId}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.price * item.quantity}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                       
                    </TableCell>
                    <TableCell >
                        <Typography variant="body1">Sub Total</Typography>
                    </TableCell>
                    <TableCell colSpan={4}>
                        <Typography variant="body1">{orderDetail.totalAmount}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                       
                    </TableCell>
                    <TableCell >
                        <Typography variant="body1">GST</Typography>
                    </TableCell>
                    <TableCell colSpan={4}>
                        <Typography variant="body1">0</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                       
                    </TableCell>
                    <TableCell >
                        <Typography variant="body1">Grand Total</Typography>
                    </TableCell>
                    <TableCell colSpan={4}>
                        <Typography variant="body1">{orderDetail.totalAmount}</Typography>
                    </TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OrderDetails;
