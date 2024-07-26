'use client'

import Image from "next/image";
import { store } from "./reduxStore/store";
import { Provider } from "react-redux";
import Homepage from "./components/Homepage";

export default function Home() {


  return (
    <Provider store={store} >
      < Homepage />
    </Provider>
  );
}
