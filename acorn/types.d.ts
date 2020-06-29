declare interface Post {
    code: string,
    description: String,
    acpDuration: string
}

declare interface RegistrationParams {
    postCode: string,
    postDescription: string,
    sessionCode: string,
    sessionDescription: string,
    status: string,
    assocOrgCode: string,
    levelOfInstruction: string,
    typeOfProgram: string,
    subjectCode1: string,
    designationCode1: string,
    primaryOrgCode: string,
    secondaryOrgCode: string,
    collaborativeOrgCode: string,
    adminOrgCode: string,
    coSecondaryOrgCode: string,
    yearOfStudy: string,
    postAcpDuration: string,
    useSws: string
}

declare interface Registration {
    registrationParams: RegistrationParams,
    sessionCode: string
}

declare interface PostAssessment {
    estimatedProgress: string,
    postCode: string,
    postDesignation: 'Program' | 'Focus' | 'Minor' | 'Major' | 'Specialist' | 'UNKNOWN',
    postTitle: string,
    postType: string,
    requirementsSession: string,
}

declare interface ProgramProgress {
    date: string,
    knownFaculty: boolean,
    lastUpdatedDate: number,
    postAssessments: [PostAssessment],
    studentID: string
}

declare interface RNResponse {
    body: string,
    responseHeaders: {},
    cookies: []
}


declare interface RNRequestOptions {
    // HTTP Method, default to GET
    method: number,
    // Request Body, this can only be a one-level object
    body: object,
    // Query String
    qs: object,
    //Not supported yet.
    headers: object,
    // Parse returned body to json and return ii directly
    json: boolean
}
