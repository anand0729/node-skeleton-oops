const userAPis = require("./../api/user");
class userController extends userAPis {
  constructor(req) {
    super(req);
    this.action = "";
    this.requestParams = req.params;
    this.requestBody = req.body;
    this.header = req.headers;
  }

  doGetAction() {
    this.action = this.requestParams.action;

    try {
      switch (this.action) {
        case "view": {
          return this.view(this.header);
        }
        case "list": {
            return this.list(this.header);
          }
        default:
          let response = {
            status: 200,
            msg: "Invalid Request",
          };
          return Promise.resolve(response);
      }
    } catch (error) {
      
      let response = {
        status: 200,
        msg: "Invalid Request",
        error: error.message,
      };
      return Promise.resolve(response);
    }
  }
}

module.exports = userController;
