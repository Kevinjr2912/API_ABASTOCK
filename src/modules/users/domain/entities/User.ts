export class User {
    constructor (
        private readonly id: string,
        private readonly firstName: string,
        private readonly middleName: string, 
        private readonly firstSurname: string,
        private readonly secondLastName: string,
        private readonly phoneNumber: string,
        private readonly email: string, 
        private readonly password: string
    ) {}

    getId () { return this.id }
    getFirstName () { return this.firstName }
    getMiddleName () { return this.middleName }
    getFirstSurname () { return this.firstSurname }
    getSecondLastName () { return this.secondLastName }
    getPhoneNumber () { return this.phoneNumber }
    getEmail () { return this.email }
    getPassword () { return this.password }
}