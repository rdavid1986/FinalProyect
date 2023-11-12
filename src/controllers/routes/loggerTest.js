
export const loggerTest = async (req, res) => {
    req.logger.fatal("fatal");
    req.logger.error("error");
    req.logger.warn("warn");
    req.logger.info("info");
    req.logger.http("http");
    req.logger.debug("debug");
    res.send({status: "ok" , message: 'Prueba de logger'});
}