export class SignUpDto {
    id!:             string
    firstName!:      string
    middleName?:    string | null
    firstSurname!:   string
    secondLastName!: string
    phoneNumber!:    string
    email!:          string
    password!:       string
}