const express = require("express");
const router = express.Router();
const { caregoryController } = require("../controller");
const { addCategoryValidator, idValidator } = require("../validators/category")
const validate = require("../validators/validate");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", isAuth, isAdmin, addCategoryValidator, validate, caregoryController.addCategory);

router.put("/:id", isAuth, isAdmin, idValidator, validate, caregoryController.updateCategory);

router.delete("/:id", isAuth, isAdmin, idValidator, validate, caregoryController.deleteCategory);

router.get("/", isAuth, caregoryController.getCategories);

router.get("/:id", isAuth, idValidator, validate, caregoryController.getCategory)

module.exports = router;