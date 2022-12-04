// On account creation create a db collection for them with default data
import * as functions from "firebase-functions";
import { auth } from "firebase-admin";
import { getDoc } from "./helpers";

const onUserSignup = functions.auth.user().onCreate((user: auth.UserRecord) => {
    const defaultDocData = {
        boards: {},
    };
    return getDoc(`users/${user.uid}`).set(defaultDocData);
});

// On account deletion, delete user data in db (note: doesn't work if you delete multiple users at once with the admin SDK)
const onUserDeleted = functions.auth.user().onDelete((user: auth.UserRecord) => {
    return getDoc(`users/${user.uid}`).delete();
});

export { onUserSignup, onUserDeleted };
