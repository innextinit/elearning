// GET request for creating teachers. NOTE This must come before route for id (i.e. display teachers).

router.get('/teachers/create', teachersController.teachersCreateGet);

// POST request for creating teachers.
router.post('/teachers/create', teachersController.teachersCreatePost);

// GET request to delete teachers.
router.get('/teachers/:id/delete', teachersController.teachersDeleteGet);

// POST request to delete teachers.
router.post('/teachers/:id/delete', teachersController.teachersDeletePost);

// GET request to update teachers.
router.get('/teachers/:id/update', teachersController.teachersUpdateGet);

// POST request to update teachers.
router.post('/teachers/:id/update', teachersController.teachersUpdatePost);

// GET request for one teachers.
router.get('/teachers/:id', teachersController.teachersDetail);

// GET request for list of all teacherss.
router.get('/teachers', teachersController.teachersList);

/// classINSTANCE ROUTES ///

// GET request for creating a classInstance. NOTE This must come before route that displays classInstance (uses id).
router.get('/classInstance/create', classInstanceController.classInstanceCreateGet);

// POST request for creating classInstance. 
router.post('/classInstance/create', classInstanceController.classInstanceCreatePost);

// GET request to delete classInstance.
router.get('/classInstance/:id/delete', classInstanceController.classInstanceDeleteGet);

// POST request to delete classInstance.
router.post('/classInstance/:id/delete', classInstanceController.classInstanceDeletePost);

// GET request to update classInstance.
router.get('/classInstance/:id/update', classInstanceController.classInstanceUpdateGet);

// POST request to update classInstance.
router.post('/classInstance/:id/update', classInstanceController.classInstanceUpdatePost);

// GET request for one classInstance.
router.get('/classInstance/:id', classInstanceController.classInstanceDetail);

// GET request for list of all classInstance.
router.get('/classInstances', classInstanceController.classInstanceList);

module.exports = router;