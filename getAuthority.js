/**
 * Retrieves the email address of the authority responsible for handling a specific type of complaint.
 * 
 * @param {string} name - The name of the complaint type.
 * @returns {string} The email address of the corresponding authority.
 */
export const getAuthority = (name) =>{
    const authorities = {
        "Academic Complaint": "vynr1504@gmail.com",
        "Administration Complaint": "vynr1504@gmail.com",
        "Hostel Complaint": "vynr1504@gmail.com",
        "Infrastructure Complaint": "vynr1504@gmail.com",
        "Medical Complaint": "vynr1504@gmail.com",
        "Ragging Complaint": "vynr1504@gmail.com"
    };

    return authorities[name] || "vynr1504@gmail.com";
}