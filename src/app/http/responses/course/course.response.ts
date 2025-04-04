import { CourseDTO } from "@/app/dto/course/course.dto";
import { Response } from "../response";

export default class CourseResponse extends Response {
    constructor(protected readonly data: CourseDTO | CourseDTO[]) {
        super()
    }
    
    protected makeData<_T>(data: CourseDTO) {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            banner_url: data.banner_url,
            demo_video_url: data.demo_video_url,
            tags: data.tags,
            stock: data.stock,
            archived: data.archived
        }
    }
}