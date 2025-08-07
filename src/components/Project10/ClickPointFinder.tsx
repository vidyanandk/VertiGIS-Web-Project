// // import type { LayoutElementProperties } from "@vertigis/web/components";
// // import { LayoutElement } from "@vertigis/web/components";
// // import Button from "@vertigis/web/ui/Button";
// // import { toast } from "react-toastify";

// // import type ClickPointFinderModel from "./ClickPointFinderModel";


// // export default function Project9(props:LayoutElementProperties<ClickPointFinderModel>) {
// //     const {model} = props;

// //     const FunctionAlert = () => {
// //         // alert("Clicked On map for Project 10");
// //         toast("Clicked On map for Project 10", {
// //             position: "top-right",
// //             autoClose: 1000,
// //         });
// //     }
// //     return (
// //         <LayoutElement {...props}>
// //            <Button onClick={() => {
// //                 FunctionAlert();
// //            }}>
// //                 Project10
// //            </Button>
// //         </LayoutElement>    
// //     )
// // }





// import type { LayoutElementProperties } from "@vertigis/web/components";
// import { LayoutElement } from "@vertigis/web/components";
// import Button from "@vertigis/web/ui/Button";
// import { toast } from "react-toastify";

// import type ClickPointFinderModel from "./ClickPointFinderModel";

// export default function ClickPointFinder(props: LayoutElementProperties<ClickPointFinderModel>) {
//     const { model } = props;

//     const handleButtonClick = () => {
//         toast("Clicked On map for Project 10", {
//             position: "top-right",
//             autoClose: 1000,
//         });
//     };

//     return (
//         <LayoutElement {...props}>
//            <Button onClick={handleButtonClick}>
//                 Project 10
//            </Button>
//         </LayoutElement>    
//     );
// }


import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import Button from "@vertigis/web/ui/Button";
import { toast } from "react-toastify";

import type ClickPointFinderModel from "./ClickPointFinderModel";

export default function ClickPointFinder(props: LayoutElementProperties<ClickPointFinderModel>) {
    const { model } = props;

    const handleButtonClick = () => {
        toast("Click on the map to find nearby features", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    return (
        <LayoutElement {...props}>
           <Button onClick={handleButtonClick}>
                Click Point Finder
           </Button>
        </LayoutElement>    
    );
}