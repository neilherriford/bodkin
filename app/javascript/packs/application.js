// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start();

import AxisAlignedBoundingBox from "./axis_aligned_bounding_box/AxisAlignedBoundingBox";
import Painter from "./painter/Painter";
import Quadrant, {QUADRANT_TYPE} from "./pmtree/Quadrant";
import Geometry  from "./geometry/Geometry";
import Pm1Validator from "./pmtree/Pm1Validator";

window.AxisAlignedBoundingBox = AxisAlignedBoundingBox;
window.Painter = Painter;
window.Quadrant = Quadrant;
window.QUADRANT_TYPE = QUADRANT_TYPE;
window.Geometry = Geometry;
window.Pm1Validator = Pm1Validator;

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
