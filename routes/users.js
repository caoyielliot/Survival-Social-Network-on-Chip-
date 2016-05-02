var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/* GET users listing. */
router.get('/', userController.getAllUsers);
router.post('/', userController.loginOrSignup); // for restfulapi
router.post('/login_or_signup', userController.loginOrSignup); // for interface
router.post('/current_user', userController.currentUser);
router.get('/active', userController.getAllActiveUsers);
router.get('/inactive', userController.getAllInActiveUsers);
router.post('/administrate_user_profile', userController.administrateUserProfile);
router.post('/:username/active', userController.setUserActive);
router.post('/:username/inactive', userController.setUserInActive);
router.post('/:username/citizen', userController.setUserPrivilegeAsCitizen);
router.post('/:username/coordinator', userController.setUserPrivilegeAsCoordinator);
router.post('/:username/monitor', userController.setUserPrivilegeAsMonitor);
router.post('/:username/administrator', userController.setUserPrivilegeAsAdministrator);
router.get('/:username', userController.checkUserName);


module.exports = router;