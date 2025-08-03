import type { LayoutElementProperties} from "@vertigis/web/components";
import {LayoutElement} from "@vertigis/web/components";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type GeometryAlertModel from "./GeometryAlertModel";

const GeometryAlert=(props: LayoutElementProperties<GeometryAlertModel>) => {
    const AlertFunction = () => {
    // alert("Clicked On map for Geometry Alert");
    toast("Clicked On map for Geometry Alert", {
        position: "top-right",
        autoClose: 1000,
        pauseOnHover: false,
        draggable: false,
        closeOnClick: true,
        style: { backgroundColor: "lightblue", color: "black" }
    });
};
    

    return (
        <LayoutElement {...props}>
            <div style={{ backgroundColor: "lightblue", padding: "20px", borderRadius: "8px", height:"50px",width:"200px", display:"flex", alignItems:"center", justifyContent:"center" }}  onClick={AlertFunction}>
                <h2 style={{color:"black"}}>Project-4</h2>
            </div>
            <ToastContainer />
        </LayoutElement>
    );
};

export default GeometryAlert;


