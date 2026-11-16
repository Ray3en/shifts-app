import { z } from "zod";
import { shiftAssignmentSchema } from "./shift-assignment.schema.js";

export const assignmentMutationResponseSchema = z.object({ data: z.array(shiftAssignmentSchema) });
