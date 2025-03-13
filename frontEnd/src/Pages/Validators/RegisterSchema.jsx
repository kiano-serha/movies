import * as yup from "yup";

const RegisterSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("This is a required field")
    .matches(/^[A-Za-z\-|'|\s]+$/, "Only letters, hyphens and apostrophes"),
  last_name: yup
    .string()
    .required("Last Name is a required field")
    .matches(/^[A-Za-z\-|'|\s]+$/, "Only letters, hyphens and apostrophes"),
  email_address: yup
    .string()
    .email("Please enter valid email address")
    .required("This is a required field"),
  password: yup
    .string()
    .required("Password is a required field")
    .test("len", "Must be longer than 8 characters", (val) => val.length > 8),
  confirm_password: yup
    .string()
    .required("Confirm is a required field")
    .oneOf([yup.ref("password"), null], "Must match password field"),
});

export default RegisterSchema;
