const Controller = require('./classess/countroller.js');
const UserInterface = require('./classess/userinterface.js')

const UI = new UserInterface();
UI.initView();

const cl = new Controller();
cl.enableSSIDChecker();