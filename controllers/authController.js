const authAPis = require("./../api/auth");
class authController extends authAPis {
  constructor(req) {
    super(req);
    this.action = "";
    this.requestParams = req.params;
    this.requestBody = req.body;
    this.header = req.headers;
  }

  doPostAction() {
    this.action = this.requestParams.action;

    /* try { */
      switch (this.action) {
        case "login":
          return this.login(this.requestBody);
        case "register":
          return this.register(this.requestBody);

        default:
          let response = {
            status: 200,
            msg: "Invalid Request",
          };
          return Promise.resolve(response);
      }
   /*  } catch (error) {
      let response = {
        status: 200,
        msg: "Invalid Request",
        error: error.message,
      };
      return Promise.resolve(response);
    } */
  }

 
}

module.exports = authController;
