// functions/submit-to-fub.js

export async function onRequest(context) {
    // Handle preflight OPTIONS request
    if (context.request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400"
            }
        });
    }

    // Check if it's a POST request
    if (context.request.method !== "POST") {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Method not allowed" 
        }), {
            status: 405,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    try {
        // Parse the request body
        const requestData = await context.request.json();
        
        // Prepare data for Follow Up Boss API
        const apiKey = "fka_0N4mnN896yfdkNErKEwUjFmBsX5rEZNNCZ";
        const apiUrl = "https://api.followupboss.com/v1/people";
        
        // Send data to Follow Up Boss
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(apiKey + ":"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || "Error submitting to Follow Up Boss");
        }
        
        // Return success response
        return new Response(JSON.stringify({ 
            success: true, 
            message: "Lead successfully submitted to Follow Up Boss" 
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        // Return error response
        return new Response(JSON.stringify({ 
            success: false, 
            message: error.message || "Internal server error" 
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}
