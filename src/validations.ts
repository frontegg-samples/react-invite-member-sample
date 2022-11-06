import * as Yup from 'yup';

export const validateSchema = (props: any) => Yup.object(props);
export const validateEmail = (invalidMessage: string, requiredMessage: string) =>
    Yup.string().email(invalidMessage).required(requiredMessage);
