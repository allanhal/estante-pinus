import bg from "../assets/bg-pinus.png";
import orange from "../assets/orange-pinus.png";

// catalog.js stores an image key (it must stay importable from Node).
const IMAGES = { bg, orange };
export const productImage = (key) => IMAGES[key] ?? orange;
export const heroImages = { bg, orange };
