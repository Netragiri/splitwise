import axios from "axios";
import {Crypt} from 'hybrid-crypto-js';
import { PUBLIC_KEY } from "../constants/index";
// import { PUBLIC_KEY } from "../components/constant";

export const baseUrl = axios.create({
  baseURL: "https://splitwisedev.herokuapp.com/api/user",
});






export const encryption = sPassword => {
  const crypt = new Crypt ();
  const encrypted = crypt.encrypt (PUBLIC_KEY, sPassword);

  return encrypted.toString ();
};

 export const api = axios.create({
    baseURL : "https://splitwisedev.herokuapp.com/api/admin"
})


 