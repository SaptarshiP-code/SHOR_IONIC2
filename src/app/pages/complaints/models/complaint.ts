export interface Complaint{
        name: string;
        emailId: string;
        mobileNumber: string;
        self: Boolean;
        relationship: string;
        reason: string;
        complainant: {
          name: string;
        };
        organisationCode: string;
        unitCode: string;
        complaint: [{
            date: string;
            time: string;
            description:string;
            location: string;
          }];
        respondent: [{
            name: string,
            relationship: string,
            department: string,
            designation: string
          }];
        respondentEmployer: boolean;
      }