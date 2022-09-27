const db = require("../config/database");
const User = db.user;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class userAPIs {
  list(data) {
    var whereCondition = {};

    if (data.filter) {
      whereCondition = {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + data.filter + "%",
            },
          },
          {
            mobile: {
              [Op.like]: "%" + data.filter + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + data.filter + "%",
            },
          },
        ],
      };
    }

    whereCondition["status"] = data.status || "a";

    try {
      return User.findAndCountAll({
        limit: parseInt(data.limit) || 5,
        offset: parseInt(data.offset) || 0,
        order: [["id", "DESC"]],
        attributes: ["id", "name", "mobile", "email"],
        where: whereCondition,
        /* required: true, */
      }).then((result) => {
        var resp = {
          status: 200,
          data: result,
        };
        return Promise.resolve(resp);
      });
    } catch (error) {
      /* console.log(error); */
    }
  }
  view(data) {
    try {
      return User.findOne({
        where: {
          id: data.id,
        },
        attributes: ["id", "name", "email", "mobile", "tenureId"],

        /* required: true, */
      }).then((result) => {
        var resp = {
          status: 200,
          data: result,
        };
        return Promise.resolve(resp);
      });
    } catch (error) {
      var response = {
        status: 200,
        error: error.message,
      };
      return Promise.resolve(response);
    }
  }
}

module.exports = userAPIs;
