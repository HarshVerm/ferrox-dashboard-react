import axios from 'axios';
import { FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_ERROR, FETCH_PRODUCTS_PENDING } from './types/types';
import { getAllOrders } from '../../services/getAllOrders'
const URL = 'http://localhost:8080';

export function fetchProductsPending() {
  return {
    type: FETCH_PRODUCTS_PENDING
  }
}

export function fetchProductsSuccess(orders) {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    orders
  }
}

export function fetchProductsError(error) {
  return {
    type: FETCH_PRODUCTS_ERROR,
    error
  }
}

export function fetchProducts() {
  return async (dispatch) => {
    try {
      dispatch(fetchProductsPending());
      const res = await getAllOrders()
      if (res.success && res.orders) {
        dispatch(fetchProductsSuccess(res.orders))
      }
    } catch (error) {
      dispatch(fetchProductsError(error));
      console.log(error);
    }
  }
}