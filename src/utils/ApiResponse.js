class ApiResponse{
    constructor(
        statuscode,
        data,
        message
    ){
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;
        this.success =(this.statuscode<400)

    }
}

//throw new ApiResponse(200, {id: 1, name: "John Doe"}, "Request was successful");

export   {ApiResponse} 
 

