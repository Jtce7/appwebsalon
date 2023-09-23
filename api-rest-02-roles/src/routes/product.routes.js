import { Router } from "express";
const router = Router();

import * as productCtrl from "../controllers/products.controller";
import { authJwt } from "../middlewares";

router.post('/', [authJwt.verifyToken, authJwt.isModerator], productCtrl.createProduct)

router.get('/', productCtrl.getProducts)

router.get('/:productId', productCtrl.getProductById)

router.put('/:productId', [authJwt.verifyToken, authJwt.isModerator], productCtrl.updateProductById)

router.delete('/:productId', [authJwt.verifyToken, authJwt.isModerator], productCtrl.deleteProductById)

export default router;