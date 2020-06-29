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

declare interface RNResponse {
    body: string,
    responseHeaders: {},
    cookies: []
}
