export default function ExecuteValidator(value ,validators, options)
{
    for(const validator of validators)
    {
        const result = validator(value, options);

        if(!result.status) return result
    }       
    
    return {status: true, error: null};
}

export const isEmail = (value, options = {}) => ({
    status: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test(value),
    error: "Invalid email address"
});

export const validatePasswd = (value, {minLength = 8, maxLength = 100, specialCharacters = true, numbers = true, capital = true} = {}) => {
    let pattern = `^`;

    pattern += capital ? `(?=.*[a-z])(?=.*[A-Z])` : `(?=.*[a-z])`;
    
    if(numbers) pattern += `(?=.*\\d)`;
    if(specialCharacters) pattern += `(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|~])`;
    
    pattern += `.{${minLength},${maxLength}}$`

    return {
    status: new RegExp(pattern).test(value),
    error: "Invalid password"
    }
}