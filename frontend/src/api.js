import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const generateOfferLetter = async (offerLetterId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/generate_offer_letter/`,
            { offer_letter_id: offerLetterId },
            { responseType: 'blob' }  // Ensures the response is a file (PDF)
        );

        // Create a URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        return url;
    } catch (error) {
        console.error("Error generating offer letter", error);
        return null;
    }
};