module.exports = (router) => {
  /**
   * @swagger
   * /<%= serviceApiName %>/sample:
   *   get:
   *     description: Sample API Doc
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   */

  router.get('/', (req, res) => {
    const data = {
      success: true,
    };

    res.json(data);
  });
};
