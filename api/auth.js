const jwt = require("jsonwebtoken");
const db = require("./../config/database");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.saltRounds);
const User = db.user;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Joi = require("@hapi/joi");
let commonFunctions = require("./commonFunctions");
class authAPIs {
  async login(body) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const errorCheck = schema.validate(body);
    if (errorCheck.error) {
      let response = {
        status: 400,
        err: errorCheck.error.details,
      };
      return Promise.resolve(response);
    }

    return db.sequelize
      .query("CALL `userCredentials`(:param1);", {
        replacements: { param1: body.username },
        type: Sequelize.QueryTypes.SELECT,
        /* logging: console.log */
      })
      .then(async (resultValues) => {
        if (resultValues) {
          let userDetails = resultValues[0][0];
          if (
            !bcrypt.compareSync(
              body.password + process.env.AppTitle,
              userDetails.password
            )
          ) {
            let resp = {
              status: 400,
              msg: "Invalid Credentials!",
              /* errType: "Password Encryption Invalid", */
            };
            return Promise.resolve(resp);
          }
          delete userDetails.password;

          let data = userDetails;
          let token = jwt.sign(
            {
              data,
            },
            process.env.TokenSecret
          );

          let response = {
            status: 200,
            token: token,
          };

          return Promise.resolve(response);
        } else {
          let resp = {
            status: 400,
            msg: "Invalid Credentials!",
            /* errType: "User Not Found", */
          };
          return Promise.resolve(resp);
        }
      })
      .catch((error) => {
        let resp = {
          status: 400,
          error: error.message,
          msg: "Invalid Credentials!",
          /* errType: "User Not Found", */
        };
        return Promise.resolve(resp);
      });
  }

  async register(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      mobile: Joi.string().required(),
      password: Joi.string().required(),
      tenureId: Joi.string().required(),
    });

    const errorCheck = schema.validate(data);
    if (errorCheck.error) {
      let response = {
        status: 400,
        data: errorCheck.error.details,
      };
      return Promise.resolve(response);
    }

    var adduser = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      tenureId: data.tenureId,
      password: bcrypt.hashSync(
        data.password + process.env.AppTitle,
        saltRounds
      ),
    };

    let customerData = await this.checkCustomerAlreadyRegistred(data);

    if (!customerData) {
      try {
        let customerId = await new commonFunctions().add(User, adduser);
        var response = {
          status: 200,
          msg: "Customer Account Created!",
          customerId: customerId,
        };
      } catch (error) {
        console.log(error.message);
      }
    } else {
      var response = {
        status: 200,
        msg: "Customer Details Already Registered!",
        customerId: customerData,
      };
    }
    return Promise.resolve(response);
  }
  checkCustomerAlreadyRegistred(data) {
    try {
      return new Promise((resolve) => {
        User.findOne({
          where: {
            [Op.or]: [{ email: data.email }, { mobile: data.mobile }],
          },
          attributes: ["id"],
          /* logging: console.log, */
        }).then((foundResult) => {
          resolve(foundResult);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = authAPIs;
