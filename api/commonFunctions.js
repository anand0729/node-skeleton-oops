class commonFunctions {
  add(table, data) {
    /* console.log(data); */
    return new Promise((resolve) => {
      table.create(data).then((createdData) => {
        if (createdData) {
          resolve(createdData.id);
        } else {
          var response = {
            status: 400,
            msg: "Error Occured while Creating User",
            error: error.message,
          };
          reject(response);
        }
      });
    });
  }

  findOne(table, whereCondition) {
    return new Promise((resolve) => {
      return table
        .findOne({
          where: whereCondition,
        })
        .then((result) => {
          resolve(result);
        });
    });
  }
}

module.exports = commonFunctions;
