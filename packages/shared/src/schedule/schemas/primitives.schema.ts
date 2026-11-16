import { z } from "zod";

export const dateSchema = z.iso.date();
export const idSchema = z.uuid();
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Время должно быть в формате ЧЧ:ММ");
