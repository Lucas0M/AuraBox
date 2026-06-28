import { Router } from "express";
import { checkoutController } from "../controllers/checkout.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createCheckoutSchema } from "../validators/checkout.validator";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post(
  "/",
  validateBody(createCheckoutSchema),
  asyncHandler((req, res) => checkoutController.create(req, res))
);

router.get(
  "/:capsuleId",
  asyncHandler((req, res) => checkoutController.getStatus(req, res))
);

export default router;
