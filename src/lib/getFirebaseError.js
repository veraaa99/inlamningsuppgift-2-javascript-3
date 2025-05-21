export const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "Email address is already in use.";
        case "auth/invalid-credential":
            return "Wrong email address or password.";
        case "auth/weak-password":
            return "Password is too weak. PLease choose a stronger password.";
        default:
            return "An unknown error occurred. PLease try again later.";
    }
}