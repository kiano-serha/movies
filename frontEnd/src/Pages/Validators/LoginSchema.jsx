import * as yup from "yup";

const LoginSchema = yup.object().shape({
  email_address: yup
    .string()
    .email("Please enter valid email address")
    .required("Email Address is a required field"),
  password: yup.string().required("Password is a required field"),
});

export default LoginSchema;
