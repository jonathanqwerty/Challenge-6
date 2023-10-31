const { images } = require("../models");
const { imageKit } = require("../utils");

require("dotenv").config();

module.exports = {
  create: async (req, res) => {
    try {
      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      const data = await images.create({
        data: {
          judul: req.body.judul,
          deskripsi: req.body.deskripsi,
          image: uploadFile.url,
        },
      });

      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  getAllImages: async (req, res) => {
    try {
      const data = await images.findMany();

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  getImageById: async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);

      const data = await images.findUnique({
        where: {
          id: imageId,
        },
      });

      if (!data) {
        return res.status(404).json({
          error: true,
          message: `image with id ${imageId} not found`,
        });
      }

      const url = data.url;

      if (typeof url === "string") {
        const name = url[1];
        const image = await imageKit.listFiles({
          searchQuery: `name = ${name}`,
        });

        data.detail = image[0];
      }

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  editImage: async (req, res) => {
    try {
      const { judul, deskripsi } = req.body;
      if (!judul || !deskripsi) {
        return res.status(400).json({
          error: true,
          message: "all fields is required.",
        });
      }

      const imageId = parseInt(req.params.imageId);

      const checkData = await images.findUnique({
        where: {
          id: imageId,
        },
      });

      if (!checkData) {
        return res.status(404).json({
          error: true,
          message: `image with id ${imageId} not found`,
        });
      }

      const data = await images.update({
        where: {
          id: imageId,
        },
        data: {
          judul: req.body.judul,
          deskripsi: req.body.deskripsi,
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  deleteImage: async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);

      try {
        const data = await images.findUnique({
          where: {
            id: imageId,
          },
        });

        if (!data) {
          return res.status(404).json({
            error: true,
            message: `Image with ID ${imageId} not found`,
          });
        }

        const url = data.url;

        if (typeof url === "string") {
          const name = url.split("/").pop(); // Get the file name from the URL
          const image = await imageKit.listFiles({
            searchQuery: `name = ${name}`,
          });

          if (image.length > 0) {
            await imageKit.deleteFile(image[0].fileId);
          }
        }

        await images.delete({
          where: {
            id: imageId,
          },
        });

        return res.status(200).json({
          message: `Image with ID ${imageId} deleted successfully`,
        });
      } catch (error) {
        return res.status(500).json({
          error: true,
          message: "An error occurred while deleting the image",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
};
