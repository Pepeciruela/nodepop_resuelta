'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const { Anuncio } = require('../../models');
const { buildAnuncioFilterFromReq } = require('../../lib/utils');

// Return the list of anuncio
router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';

  const filters = buildAnuncioFilterFromReq(req);

  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ result: anuncios });
  });
});

// Return the list of available tags
router.get('/tags', asyncHandler(async function (req, res) {
  const distinctTags = await Anuncio.distinct('tags');
  res.json({ result: distinctTags });
}));

// Create
router.post('/', [ // validaciones:
  body('tags').custom(tags => {
    const allowed = Anuncio.allowedTags();
    return tags.every(tag => allowed.includes(tag)) 
  }).withMessage(`allowed tags ${Anuncio.allowedTags()}`),
  body('venta').isBoolean().withMessage('must be boolean'),
  body('precio').isNumeric().withMessage('must be numeric'),
], asyncHandler(async (req, res) => {
  
  validationResult(req).throw();
  const anuncioData = req.body;

  const anuncio = new Anuncio(anuncioData);
  const anuncioGuardado = await anuncio.save();

  res.json({ result: anuncioGuardado });

}));

module.exports = router;
