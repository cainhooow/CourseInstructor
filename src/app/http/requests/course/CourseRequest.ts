import Request from "../Request";

type TCourseRequest = {
    name: string;
    description: string;
    stock: number;
}

export default class CourseRequest extends Request<TCourseRequest> {

}