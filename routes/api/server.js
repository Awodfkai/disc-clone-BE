const express = require('express');

const { Server, ServerMember, Channel } = require('../../db/models');
const { asyncHandler } = require('../../utils');
const { authenticated } = require('../../auth');

const router = express.Router();

router.post(
  '/create',
  authenticated,
  asyncHandler(async (req, res, next) => {
    const { name, user_id } = req.body;
    const server = await Server.create({
      name,
    });
    await ServerMember.create({
      server_id: server.id,
      user_id,
      role_id: 1,
    })
    await Channel.create({
      server_id: server.id,
      name: 'General'
    })
    res.status(201).json(server)
  })
)

router.post(
  '/:id/join',
  authenticated,
  asyncHandler(async (req, res, next) => {
    const server_id = req.params.id;
    const { user } = req.body;
    await ServerMember.create({
      server_id,
      user_id: user.id,
      role_id: 2,
    })
    res.status(201).json(server)
  })
)

router.delete(
  '/:id',
  authenticated,
  asyncHandler(async (req, res, next) => {
    await Server.destroy({id:req.params.id})
  })
)

module.exports = router;