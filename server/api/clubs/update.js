// -----------------------------------------------------------------------------

import logger from "../../logger";
import conf from "../../conf";
import { authCheck } from "../../auth";
import { ObjectId } from "mongodb";

// -----------------------------------------------------------------------------
// PATCH:
// {
// 	"id":"5e40c4be59e6b47f3de9f178",
// 	"data": {
// 	    "notes": "CN 9:00-14:00",
//     }
// }

// -----------------------------------------------------------------------------

export default (db, app) => {
  app.patch(conf.api.clubs.url, (req, res) => {
    // DEBUG:
    logger.debug(`api.clubs.update(): req headers = ${JSON.stringify(req.headers)}`);
    logger.debug(`api.clubs.update(): req params  = ${JSON.stringify(req.params)}`);
    logger.debug(`api.clubs.update(): req body    = ${JSON.stringify(req.body)}`);

    let apiReq = req.body;
    if (!apiReq || !apiReq.data || !apiReq.id || !req.headers["authorization"]) {
      let error = Error(`api.clubs.update(): Invalid request data.`);
      logger.debug(error.message);
      res.status(422).json(error);
      return;
    } else {
      apiReq.token = req.headers["authorization"].substr("Bearer ".length);
      apiReq.function = "update clubs";

      authCheck(db, apiReq)
        .then(apiReq => {
          db.collection("clubs")
            .find({ _id: ObjectId(apiReq.id) })
            .limit(1)
            .next()
            .then(club => {
              if (!club) {
                let error = Error("api.clubs.update(): No record found");
                logger.warn(error.message);
                res.status(422).json(error);
              } else {
                // DEBUG:
                logger.debug(`api.clubs.update(): apiReq = ${JSON.stringify(apiReq)}`);
                logger.debug(`api.clubs.update():   club = ${JSON.stringify(club)}`);

                // update changes: array of {date: Date, user: {id, facebook}, change: {k1: change1, k2: change2...} }
                let change = {
                  date: new Date(),
                  user: apiReq.user,
                  change: {}
                };
                Object.keys(apiReq.data).forEach(k => {
                  change.change[k] = `${JSON.stringify(club[k])} => ${JSON.stringify(apiReq.data[k])}`;
                });
                // DEBUG:
                logger.debug(`api.clubs.update(): change = ${JSON.stringify(change)}`);

                apiReq.data.changes = club.changes;
                if (!apiReq.data.changes) {
                  apiReq.data.changes = [];
                }
                apiReq.data.changes.push(change);
                // DEBUG:
                logger.debug(`api.clubs.update(): club = ${JSON.stringify(club)}`);
                logger.debug(`api.clubs.update(): apiReq.data = ${JSON.stringify(apiReq.data)}`);

                // db update
                db.collection("clubs")
                  .updateOne({ _id: ObjectId(apiReq.id) }, { $set: apiReq.data })
                  .then(result => {
                    if (result && result.modifiedCount == 1) {
                      let successMsg = `api.clubs.update(): Update success`;
                      logger.debug(successMsg);
                      res.status(200).json({ message: successMsg });
                    } else {
                      let error = Error("api.clubs.update(): No record updated");
                      logger.debug(error.message);
                      res.status(204).json(error);
                    }
                  })
                  .catch(err => {
                    let error = Error(`api.clubs.update(): update() failed. ${err}`);
                    logger.warn(error.message);
                    res.status(422).json(error);
                  });
              }
            })
            .catch(err => {
              let error = Error(`api.clubs.update(): find() failed: ${err}`);
              logger.warn(error.message);
              res.status(422).json(error);
            });
        })
        .catch(err => {
          let error = Error(`api.clubs.update(): Auth failed: ${err}`);
          logger.warn(error.message);
          res.status(422).json(error);
        });
    }
  });
};

// -----------------------------------------------------------------------------
