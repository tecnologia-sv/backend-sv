const Sequalize = require("sequelize");
const db = require("../data/database");

// Deliverers model
const Deliverers = db.define("Deliverers", {
  // Primary key to identify the Deliver
  id: {
    type: Sequalize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  userId: {
    type: Sequalize.INTEGER,
  },

  /////////////////////////////////
  ///   Deliverer information   ///
  /////////////////////////////////


  name: {
    type: Sequalize.STRING,
    unique: true,
    allowNull: false,
  },

  lastName: {
    type: Sequalize.STRING,
    allowNull: false,
  },

  // Deliverer code is usually the vehicle's plate
  delivererCode: {
    type: Sequalize.STRING,
    allowNull: false,
  },
  

  // Document type either CC or NIT
  documentType: {
    type: Sequalize.STRING,
    allowNull: false,
  },

  // Number of the document
  documentId: {
    type: Sequalize.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      //Document number cannot be to short
      min: {
        args: 9999999,
        msg: "El documento de identidad no es válido"
      },
    },
  },

  email: {
    type: Sequalize.STRING,
    allowNull: true,
    validate: {
      // Verify Is a valid email
      isEmail: {
        msg: "El email no es válido"
      },
    },
  },

  cellphone: {
    type: Sequalize.BIGINT,
    allowNull: false,
    validate: {
      // Validate if cellphone is valid in Colombia and Ecuador
      isNumeric: true,
      max: {
        args: 3999999999,
        msg: "El Número celular no es válido"
      },
      min: {
        args: 3000000000,
        msg: "El Número celular no es válido"
      },
    },
  },

  documentImage: {
    type: DataTypes.STRING(70),
    allowNull: true,
    unique: true,
  },


  /////////////////////////////////
  ///   Vehicle information     ///
  /////////////////////////////////

  plate: {
    type: Sequalize.STRING,
    unique: true,
    allowNull: false,
  },

  soatExpirationDate: {
    type: Sequalize.DATE,
    unique: false,
    allowNull: true
  },

  soatImage: {
    type: DataTypes.STRING(70),
    allowNull: true,
    unique: true,
  },

  technomechanialcExpirationDate: {
    type: Sequalize.DATE,
    unique: false,
    allowNull: true
  },

  technomechanicalImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },

  propertyCardImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },

  vehicleImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },

  weight: {
    type: Sequalize.FLOAT,
    allowNull: true,
  },

  volume: {
    type: Sequalize.FLOAT,
    allowNull: true
  },


  /////////////////////////////////
  ///    license information    ///
  /////////////////////////////////

  licenseImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },


  phytosanitaryExpirationDate: { 
    type: Sequalize.DATE, 
    allowNull: true
  },

  phytosanitaryImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },

  arlExpirationDate: { 
    type: Sequalize.DATE, 
    allowNull: true
  },

  arlImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },

  epsExpirationDate: { 
    type: Sequalize.DATE, 
    allowNull: true
  },

  epsCertificationImage: {
    type: Sequalize.STRING(70),
    allowNull: true,
    unique: true,
  },

  contractType: {
    type: Sequalize.STRING,
    allowNull: true,
    unique: false
  },

  contractExpirationDate: {
    type: Sequalize.DATE, 
    allowNull: true
  },

  constractFile: {
    type: Sequalize.STRING,
    allowNull: true
  },

  paymentFile: {
    type: Sequalize.STRING,
    allowNull: true
  },

  // deliverer statuses
  // 0 = active client, 1 = inactive
  status: {
    type: Sequalize.INTEGER,
    defaultValue: 0,
  }
});

module.exports = Deliverers;