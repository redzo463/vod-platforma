import { z } from "zod"

export const videoMetadataSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(5000, "Description is too long").optional(),
    thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export type VideoMetadataSchema = z.infer<typeof videoMetadataSchema>
