// Connection to azure database
const dataBase = require("../data/database");
const sql = require("mssql");
const _ = require("underscore");
const fs = require("fs");

// Connection to azure blob storage
const config = require("../config");
const azureStorage = require("azure-storage");
const blobService = azureStorage.createBlobService();
const containerName = "deliverers";

// config stream for ease of use
const getStream = require("into-stream");

const Deliverers = require("../models/Deliverers");
const { Op } = require("sequelize");
const shortid = require("shortid");

// max file size
const MAX_SIZE = 5 * 1024 * 1024;

exports.delivererGetById = async (req, res) => {
    const { id } = req.params;
    console.log("Viewing deliverer with id: ", id);
    try {
      const deliverer = await Deliverers.findAll({
        where: {
          id: id
        },
      });
  
      const {
        documentImage,
        soatImage,
        technomechanicalImage,
        propertyCardImage,
        vehicleImage,
        licenseImage,
        phytosanitaryImage,
        arlImage,
        epsCertificationImage,
        console,
        paymentFile,
      } = deliverer[0].dataValues;
  
      const fileBlobs = [
        documentImage,
        soatImage,
        technomechanicalImage,
        propertyCardImage,
        vehicleImage,
        licenseImage,
        phytosanitaryImage,
        arlImage,
        epsCertificationImage,
        console,
        paymentFile,
      ];
  
      const fileStreams = fileBlobs.map((blob) => {
        return blobService.createReadStream(containerName, blob);
      });
  
      /*
      fileStreams.forEach((stream) => {
        stream.pipe(res);
      });
      */
  
      fileStreams[4].pipe(res);
  
      // res.json(leader);
    } catch (error) {
      console.log(error);
      if (error.errors) {
        console.log(error.errors[0]);
      }
      res.status(500).send(error.message);
    }
  };

exports.deliverersCreate = async (req, res) => {
    try {
      console.log(req.body);
  
      const {
        name,
        lastName,
        cellphone,
        documentType,
        documentId,
        email,
        plate,
        soatExpirationDate,
        technomechanialcExpirationDate,
        weight,
        volume,
        phytosanitaryExpirationDate,
        arlExpirationDate,
        epsExpirationDate,
        contractType,
        contractExpirationDate,

      } = req.body;
  
      console.log(req.body);
  
      const matches = await Deliverers.findAll({
        where: {
          [Op.or]: [
            { documentId: documentId },
            { cellphone: cellphone.toString() },
            { delivererCode: delivererCode.toString() },
            { email: email },
          ],
        },
      });
  
      console.log(matches);
  
      if (matches.length > 0) {
        console.log("El transportador ya fue registrado");
        return res.status(406).send("El transportador ya fue registrado");
      }
  
      const genBlobName = (originalName) => {
        const identifier = shortid.generate().toString().replace(/0\./, "");
        return `${identifier}-${originalName}`;
      };
  
      let correctFileSizes = true;
      for (let i = 0; i < req.files.length; i++) {
        correctFileSizes = correctFileSizes || req.files[i].size < MAX_SIZE;
      }
  
      if (!correctFileSizes) {
        return res.status(406).send("Archivos exceden maximo tamano");
      }
  
      const fileBlobKeys = _.object(
        req.files.map((file, i) => {
          const nameKeys = [
            "documentImage",
            "soatImage",
            "technomechanicalImage",
            "propertyCardImage",
            "vehicleImage",
            "licenseImage",
            "phytosanitaryImage",
            "arlImage",
            "epsCertificationImage",
            "constractFile",
            "paymentFile"
          ];
          const blobName = genBlobName(
            `${nameKeys[i]}-${name.trim()}-${lastName.trim()}`
          );
          const stream = getStream(file.buffer);
          const streamLength = file.buffer.length;
  
          blobService.createBlockBlobFromStream(
            containerName,
            blobName,
            stream,
            streamLength,
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log("Subida de archivo exitosa");
            }
          );
  
          return [file.fieldname, blobName];
        })
      );
  
      console.log(fileBlobKeys);
  
      const deliverer = await Deliverers.create({
        name: name,
        lastName: lastName,
        cellphone: cellphone,
        documentType: documentType,
        documentId: documentId.toString(),
        email: email,
        zoneId: zoneId.toString(),
        delivererCode: plate.toString(),
        plate: plate.toString(),
        soatExpirationDate: soatExpirationDate,
        technomechanialcExpirationDate: technomechanialcExpirationDate,
        weight: weight.toString(),
        volume: volume.toString(),
        phytosanitaryExpirationDate: phytosanitaryExpirationDate,
        arlExpirationDate: arlExpirationDate,
        epsExpirationDate: epsExpirationDate,
        contractType: contractType,
        contractExpirationDate: contractExpirationDate,
        documentImage: fileBlobKeys["documentImage"],
        soatImage: fileBlobKeys["soatImage"],
        technomechanicalImage: fileBlobKeys["technomechanicalImage"],
        propertyCardImage: fileBlobKeys["propertyCardImage"],
        vehicleImage: fileBlobKeys["vehicleImage"],
        licenseImage: fileBlobKeys["licenseImage"],
        phytosanitaryImage: fileBlobKeys["phytosanitaryImage"],
        arlImage: fileBlobKeys["arlImage"],
        epsCertificationImage: fileBlobKeys["epsCertificationImage"],
        console: fileBlobKeys["constractFile"],
        paymentFile: fileBlobKeys["paymentFile"],
      });
  
      res.send("Transportador creado correctamente");
    } catch (error) {
      if (error.errors) {
        const { errors } = error;
        const message = errors[0].value + " : " + errors[0].type;
        console.log(message);
        res.status(406).send(message);
      }
      console.log(error.message);
      res.status(500).send(error.message);
    }
  };

  exports.deliverersDelete = async (req, res) => {
    const { id } = req.params;
    console.log("Deleting deliverer with id: ", id);
    try {
      const deliverer = await Deliverers.findAll({
        where: {
          id: id,
        },
      });
  
      console.log(deliverer[0].dataValues);
  
      const {
        documentImage,
        soatImage,
        technomechanicalImage,
        propertyCardImage,
        vehicleImage,
        licenseImage,
        phytosanitaryImage,
        arlImage,
        epsCertificationImage,
        console,
        paymentFile,
      } = deliverer[0].dataValues;
  
      const fileBlobs = [
        documentImage,
        soatImage,
        technomechanicalImage,
        propertyCardImage,
        vehicleImage,
        licenseImage,
        phytosanitaryImage,
        arlImage,
        epsCertificationImage,
        console,
        paymentFile,
      ];
  
      fileBlobs.map((blobName) => {
        blobService.deleteBlobIfExists(containerName, blobName, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Archivo borrado correctamente.");
        });
      });
  
      const deletedDeliverer = await Deliverers.destroy({
        where: {
          id: id,
        },
      });
  
      res.json(`Deleted deliverer with ID : ${id}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };