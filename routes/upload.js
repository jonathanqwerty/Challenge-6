const express = require("express"),
  router = express.Router(),
  controller = require("../controller/imagesController"),
  multer = require("../middlewares/multer"),
  multerLib = require("multer")();

router.post("/create", multerLib.single("image"), controller.create);
router.get("/images", controller.getAllImages);
router.get("/images/:imageId", controller.getImageById);
router.put("/images/:imageId", controller.editImage);
router.delete("/images/delete/:imageId", controller.deleteImage);

module.exports = router;
