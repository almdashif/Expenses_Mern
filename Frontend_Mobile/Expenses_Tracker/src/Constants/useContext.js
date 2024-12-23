import { useContext } from "react";
import { GlobalContext } from "../../App";
const context = useContext(GlobalContext);
const { cstate, cdispatch } = context;
export {cstate, cdispatch}